from flask import request, current_app as flask_app
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import func
import googlemaps
import json

from app.api.errors import badrequest
from app.extensions import db
from app.models import *
from app.api import bp


def distance_between_two_points(distance, start, destination):
    # Calculate distance between start and destination
    # with distance between neighbouring stops
    dist = 0
    for i in range(start, destination):
        dist += distance[i]

    return dist


def select_next_min_distant_point(distances, selected_step_pos):
    # Iterate through distances[] and return next position
    # that has the min threshold distance in between
    all_visited = None
    is_selected = None
    dist_from_selected = 0
    min_threshold_distance = int(
        flask_app.config["THRESHOLD_DISTANCE_BETWEEN_LEGS"])

    if (selected_step_pos >= len(distances) - 1):
        all_visited = True

    for pos in range(selected_step_pos, len(distances)):
        dist_from_selected = distance_between_two_points(
            distances, selected_step_pos, pos + 1)

        if (pos == len(distances) - 1):
            all_visited = True

        if (dist_from_selected >= min_threshold_distance):
            is_selected = True
            selected_step_pos = pos
            break

    return {
        'all_visited': all_visited,
        'is_selected': is_selected,
        'dist_from_selected': dist_from_selected,
        'next_distant_point_pos': selected_step_pos
    }


@bp.route('/api/v1/get_routes_data', methods=['POST'])
def get_routes_data():
    data = request.get_json()
    GOOGLE_MAPS_API_KEY = flask_app.config["GOOGLE_MAPS_API_KEY"]
    gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

    start_location = data["start_location"]
    end_location = data["end_location"]

    # get directions
    # map_routes = gmaps.directions('{},{}'.format(start_location["lat"], start_location["lng"]), '{},{}'.format(end_location["lat"], end_location["lng"]),
    #                               mode="driving", units="metric", alternatives=True)

    # ToDo: for development only
    with open('sample.json') as sample_file:
        map_data = json.load(sample_file)
        map_routes = map_data["routes"]

        routes = []

        if map_routes is not None and len(map_routes) > 0:
            for current_route in map_routes:
                legs = []
                if current_route["legs"] is not None:
                    for leg in current_route["legs"]:
                        if leg["steps"] is not None:
                            distances = []
                            nearest_aqi_points = []
                            next_distant_point_pos = 0

                            # iterate through each step
                            # store distance between each point (except destination)
                            for cur_step in range(len(leg["steps"]) - 1):
                                step = leg["steps"][cur_step]
                                distances.append(step["distance"]["value"])

                            # Manually find nearby points of source & destination of route
                            for pos in [0, -1]:
                                static_point = leg["steps"][pos]
                                lat = static_point["start_location" if pos ==
                                                   0 else "end_location"]["lat"]
                                lng = static_point["start_location" if pos ==
                                                   0 else "end_location"]["lng"]
                                # Find nearest node_aqi from the point
                                nearest_aqi_node = Place.get_nearby_aqi_node(
                                    lat, lng)
                                point_on_map = {
                                    'aqi': nearest_aqi_node["aqi"] if (nearest_aqi_node is not None) else None,
                                    'location': static_point["start_location" if pos ==
                                                             0 else "end_location"],
                                    'name': nearest_aqi_node["name"] if (nearest_aqi_node is not None) else None,
                                    'distance':
                                        {'value': 0} if pos == 0 else leg["distance"],
                                    'updated_at': nearest_aqi_node["updated_at"] if (nearest_aqi_node is not None) else None
                                }
                                # Push point to array of aqi points
                                nearest_aqi_points.append(point_on_map)

                            # Find the next subsequent points(excluding destination)
                            for _ in range(len(distances)):
                                # Find the next step that has minimum threshold distance in between
                                selected_response = select_next_min_distant_point(
                                    distances, next_distant_point_pos)

                                # Exit if all visited
                                if (selected_response["all_visited"] and selected_response["is_selected"] is None):
                                    break

                                # threshold distant location Found!
                                next_distant_point_pos = selected_response["next_distant_point_pos"]
                                # Get selected leg from original data
                                selected_step = leg["steps"][next_distant_point_pos]

                                # Find nearest values within 1500m of this coordinate from database
                                nearest_aqi_node = Place.get_nearby_aqi_node(
                                    selected_step["end_location"]["lat"], selected_step["end_location"]["lng"])

                                # Push value if aqi_node found
                                if (nearest_aqi_node is not None):
                                    # Leg to draw on map with aqi values of 1500m near node
                                    new_point_on_map = {
                                        'aqi': nearest_aqi_node["aqi"] if (nearest_aqi_node is not None) else None,
                                        'location': selected_step["end_location"],
                                        'name': nearest_aqi_node["name"] if (nearest_aqi_node is not None) else None,
                                        'distance': {
                                            'value': selected_response["dist_from_selected"],
                                        },
                                        'updated_at': nearest_aqi_node["updated_at"] if (nearest_aqi_node is not None) else None
                                    }
                                    # Push to array of aqi points (before the last entry)
                                    nearest_aqi_points.insert(
                                        len(nearest_aqi_points) - 1, new_point_on_map)

                                # If last item was selected, stop iteration
                                if (selected_response["all_visited"] and selected_response["is_selected"]):
                                    break
                                # move to next position & continue iteration
                                next_distant_point_pos += 1

                            legs.append({
                                'steps': nearest_aqi_points,
                                'total': len(nearest_aqi_points)
                            })

                    routes.append({
                        'legs': legs,
                        'total': len(legs),
                        'overview_polyline': current_route["overview_polyline"],
                        'summary': current_route["summary"]
                    })

        return {
            'response': {
                'statusCode': 200,
                'statusText': 'OK'
            },
            'data': {
                'data': {
                    'routes': routes,
                    'total': len(routes)
                },
                'status': True
            }
        }

    return badrequest('Error opening the sample file')


def get_place_by_spatial_data(location):
    place = Place.query.filter(
        func.ST_Equals(Place.geometric_point, location)).first()
    if not place:
        return None

    return place


@bp.route('/api/v1/save_place_data', methods=['POST'])
def save_place_data():
    data = request.get_json()
    try:
        coordinates = data["location"]['coordinates']
        # create geometric point (lng, lat) order
        geo_point = func.ST_SetSRID(func.ST_MakePoint(
            coordinates['lng'], coordinates['lat']), 4326)
        data = {
            'name': data["name"],
            'aqi': data["pollution"]["aqi"],
            'type': data["location"]["type"],
            'location': coordinates,  # JSON
            'geometric_point': geo_point
            # ToDo: update `updated_at` field
        }

        place_exists = None
        # update or save new entry
        place = get_place_by_spatial_data(geo_point)
        if not place:
            place_exists = False
            place = Place()
        else:
            place_exists = True

        place.from_dict(data)
        if not place_exists:
            db.session.add(place)
        db.session.commit()

        return {
            'response': {
                'statusCode': 201 if not place_exists else 200,
                'statusText': 'OK'
            },
            'data': {
                'status': True,
                'message': 'Air quality data for place saved.',
            }
        }
    except SQLAlchemyError as e:
        db.session.rollback()
        print(e)
        return badrequest('Saving to database failed')
    except Exception as e:
        print(e)
        return badrequest('Check body content')
