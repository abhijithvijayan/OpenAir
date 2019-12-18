import json
import requests
from flask import request, current_app as flask_app

from app.api import bp


@bp.route('/api/v1/getRoutesData', methods=['POST'])
def getRoutesAQI():
    data = request.get_json()

    start_location = data["start_location"]
    end_location = data["end_location"]
    GOOGLE_MAPS_API_KEY = flask_app.config["GOOGLE_MAPS_API_KEY"]

    r = requests.get('https://maps.googleapis.com/maps/api/directions/json?origin={},{}&destination={},{}&sensor=false&units=metric&alternatives=true&key={}'.format(
        start_location["latitude"], start_location["longitude"], end_location["latitude"], end_location["longitude"],
        GOOGLE_MAPS_API_KEY))

    return json.loads(r.content.decode('utf-8-sig'))
