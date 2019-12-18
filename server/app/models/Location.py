from datetime import datetime
from geoalchemy2 import Geometry
from geoalchemy2.comparator import Comparator
from sqlalchemy import text
from sqlalchemy.sql import func, cast
from sqlalchemy.dialects.postgresql import UUID, JSON

from app import db


class Location(db.Model):
    uuid = db.Column(UUID(as_uuid=True),
                     primary_key=True,
                     server_default=text("uuid_generate_v4()"))
    name = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now())
    aqi = db.Column(db.Integer, nullable=False)
    # For Near Location Querying
    geometric_point = db.Column(
        Geometry(geometry_type='POINT', srid=4326), nullable=False)
    # Raw Coordinates
    coordinates = db.Column(JSON, nullable=False)
    # History Data id: Can be null but must be unique
    ref_id = db.Column(db.String(40), unique=True, nullable=True)

    # method tells Python how to print objects of this class
    def __repr__(self):
        return '<Location {}>'.format(self.name)

    # ToDo: Refactor to get nearest within specified distance
    def get_nearby_aqi_node(latitude, longitude):
        #
        # The PostGIS <-> operator that translates into distance_centroid in geoalchemy2, will do an index based Nearest Neighbour (NN) search.
        #
        point = db.session.query(Location.name,
                                 Location.aqi,
                                 Location.coordinates,
                                 Location.updated_at).\
            order_by(
            Comparator.distance_centroid(Location.geometric_point,
                                         func.Geometry(func.ST_GeographyFromText(
                                             'POINT({} {})'.format(longitude, latitude))))).limit(1).first()

        #
        # ST_Distance forces the database to calculate the distance between the query Point and every location in the table, then sort them all and take the first result.
        #
        # point = db.session.query(Location.name,
        #                          Location.aqi,
        #                          Location.coordinates).\
        #     order_by(
        #     func.ST_Distance(Location.geometric_point,
        #                      func.Geometry(func.ST_GeographyFromText(
        #                          'POINT({} {})'.format(longitude, latitude))))).limit(1).first()

        point_object = {
            'name': point[0],
            'aqi': point[1],
            'coordinates': point[2],
            'updated_at': point[3]
        }

        return point_object
