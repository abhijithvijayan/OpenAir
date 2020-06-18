from sqlalchemy.dialects.postgresql import UUID, JSON
from geoalchemy2.comparator import Comparator
from flask import current_app as flask_app
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import func, cast
from geoalchemy2 import Geometry
from datetime import datetime
from sqlalchemy import text

from app.factory import db


class Place(db.Model):
    __tablename__ = 'openair_place'

    uuid = db.Column(UUID(as_uuid=True),
                     unique=True,
                     server_default=text("uuid_generate_v4()"))
    id = db.Column(db.Integer, index=True, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(10), nullable=False)
    aqi = db.Column(db.Integer, nullable=False)
    # 4326: projection defines lat/long coordinate system
    geometric_point = db.Column(
        Geometry(geometry_type='POINT', srid=4326), nullable=False)
    # Raw location
    location = db.Column(JSON, nullable=False)
    # History Data id: Can be null but must be unique
    ref_id = db.Column(db.String(40), unique=True, nullable=True)
    # ---- Meta data ---- #
    created_at = db.Column(db.DateTime, index=True,
                           server_default=func.now())
    updated_at = db.Column(db.DateTime, index=True,
                           server_default=func.now())  # ToDo: fix auto updation

    # method tells Python how to print objects of this class
    def __repr__(self):
        return '<Place {}>'.format(self.name)

    def get_nearby_aqi_node(lat, lng):
        # ToDo: Refactor to be more precise: https://stackoverflow.com/a/20936147
        dist_in_meters = int(
            flask_app.config["CIRCULAR_COVERAGE_DISTANCE_FROM_NODE"])
        dist_in_miles = dist_in_meters * 0.621371192 / 1000
        dist_in_degree_radius = dist_in_miles * 0.014472

        # load longitude & latitude
        geo_point = func.ST_GeographyFromText('POINT({} {})'.format(lng, lat))
        # Well-Known Binary format
        geo_wkb = func.Geometry(geo_point)

        # ToDo: split into functions to iterate through multiple points in one session
        # print("New session for this single query")

        # get closest point
        try:
            # `distance_centroid` will do an index based Nearest Neighbour (NN) search.
            nearby_point = db.session.query(Place.name,
                                            Place.aqi,
                                            Place.location,
                                            Place.updated_at).\
                filter(func.ST_DFullyWithin(Place.geometric_point, geo_wkb, dist_in_degree_radius)).\
                order_by(
                Comparator.distance_centroid(Place.geometric_point, geo_wkb)).limit(1).first()

            if (nearby_point is not None):
                place_object = {
                    'name': nearby_point[0],
                    'aqi': nearby_point[1],
                    'location': nearby_point[2],
                    'updated_at': nearby_point[3]
                }

                return place_object
            return None
        except SQLAlchemyError as e:
            return None
        except Exception as err:
            print('Unknown error', err)
            return None
