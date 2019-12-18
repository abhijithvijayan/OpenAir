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


@bp.route('/api/v1/getRoutesData', methods=['POST'])
def getRoutesAQI():
    data = request.get_json()

    start_location = data["start_location"]
    end_location = data["end_location"]
    # GOOGLE_MAPS_API_KEY = flask_app.config["GOOGLE_MAPS_API_KEY"]

    # r = requests.get('https://maps.googleapis.com/maps/api/directions/json?origin={},{}&destination={},{}&sensor=false&units=metric&alternatives=true&key={}'.format(
    #     start_location["latitude"], start_location["longitude"], end_location["latitude"], end_location["longitude"],
    #     GOOGLE_MAPS_API_KEY))

    with open('sample.json') as sample_file:
        map_data = json.load(sample_file)
        routes = map_data["routes"]

        distances = []
        selected_step = None
        nearest_aqi_node = None
        dist_from_selected = 0

        if routes is not None and len(routes) > 0:
            current_route = routes[0]
            if current_route["legs"] is not None:
                # ToDo: There can be multiple legs
                for leg in current_route["legs"]:
                    if leg["steps"] is not None:
                        # iterate through each step
                        for step in leg["steps"]:
                            # store all distance between each point
                            distances.append(step["distance"]["value"])

                        # Find the next step that has minimum of 3000m distance in between
                        selected_step_pos = 0
                        for pos in range(len(distances)):
                            dist_from_selected = distance_between_two_points(
                                distances, selected_step_pos, pos + 1)
                            if (dist_from_selected >= 3000):
                                selected_step_pos = pos
                                break

                        selected_step = leg["steps"][selected_step_pos]
                        # Find nearest values within 1500m of this coordinates from database
                        nearest_aqi_node = Location.get_nearby_aqi_node(
                            selected_step["start_location"]["lat"], selected_step["start_location"]["lng"])

        # return json.loads(r.content.decode('utf-8-sig'))
    return jsonify({'selected': selected_step["start_location"], 'nearest': nearest_aqi_node})
