import json
import requests
from flask import request, current_app as flask_app, jsonify

from app.api import bp
from app.models import Location


def distance_between_two_points(distance, start, destination):
    # Calculate distance between start and destination
    # with distance between neighbouring stops
    dist = 0
    for i in range(start, destination):
        dist += distance[i]

    return dist


def select_next_min_distant_point(distances, selected_step_pos):
    # Iterate through distances[] and return next position
    # with 3000m distance in between
    all_visited = None
    cur_selected = selected_step_pos
    dist_from_selected = 0

    if (selected_step_pos >= len(distances) - 1):
        all_visited = True

    for pos in range(selected_step_pos, len(distances)):
        print('pos', pos)

        dist_from_selected = distance_between_two_points(
            distances, selected_step_pos, pos + 1)

        if (dist_from_selected >= 3000):
            selected_step_pos = pos
            print('selected', selected_step_pos)
            break

        if (pos == len(distances) - 1):
            all_visited = True

    return {
        'all_visited': all_visited,
        'dist_from_selected': dist_from_selected,
        'next_distant_point_pos': selected_step_pos
    }


@bp.route('/api/v1/getRoutesData', methods=['POST'])
def getRoutesAQI():
    data = request.get_json()

    start_location = data["start_location"]
    end_location = data["end_location"]
    # GOOGLE_MAPS_API_KEY = flask_app.config["GOOGLE_MAPS_API_KEY"]

    # r = requests.get('https://maps.googleapis.com/maps/api/directions/json?origin={},{}&destination={},{}&sensor=false&units=metric&alternatives=true&key={}'.format(
    #     start_location["latitude"], start_location["longitude"], end_location["latitude"], end_location["longitude"],
    #     GOOGLE_MAPS_API_KEY))
    # map_data = json.loads(r.content.decode('utf-8-sig'))

    # ToDo: Replace this with API Call in production
    with open('sample.json') as sample_file:
        map_data = json.load(sample_file)
        map_routes = map_data["routes"]

        routes = []

        if map_routes is not None and len(map_routes) > 0:
            for current_route in map_routes:
                legs = []
                if current_route["legs"] is not None:
                    # ToDo: There can be multiple legs
                    for leg in current_route["legs"]:
                        if leg["steps"] is not None:
                            distances = []
                            nearest_aqi_points = []
                            next_distant_point_pos = 0

                            # iterate through each step
                            for step in leg["steps"]:
                                # store all distance between each point
                                distances.append(step["distance"]["value"])

                            print('distances', distances)

                            for i in range(len(distances)):
                                # Find the next step that has minimum of 3000m distance in between
                                selected_response = select_next_min_distant_point(
                                    distances, next_distant_point_pos)

                                print(selected_response)

                                if (selected_response["all_visited"]):
                                    break

                                # Found a 3000m distant location
                                next_distant_point_pos = selected_response["next_distant_point_pos"]

                                # Get selected leg from original data
                                print(next_distant_point_pos)
                                selected_step = leg["steps"][next_distant_point_pos]
                                # Find nearest values within 1500m of this coordinates from database
                                nearest_aqi_node = Location.get_nearby_aqi_node(
                                    selected_step["start_location"]["lat"], selected_step["start_location"]["lng"])

                                # Leg to draw on map with aqi values of 1500m near node
                                new_point_on_map = {
                                    'aqi': nearest_aqi_node["aqi"],
                                    'updated_at': nearest_aqi_node["updated_at"],
                                    'start_location': selected_step["start_location"],
                                    'end_location': selected_step["end_location"],
                                    'distance': {
                                        'value': selected_response["dist_from_selected"],
                                    },
                                    'polyline': selected_step["polyline"],
                                }
                                # Push to array of aqi points
                                nearest_aqi_points.append(new_point_on_map)

                                # move to next position & continue iteration
                                next_distant_point_pos += 1

                            legs.append({
                                'steps': nearest_aqi_points
                            })

                    routes.append({
                        'legs': legs
                    })

    return jsonify({
        'routes': routes,
        'status': 'ok'
    })
