from datetime import datetime
from geoalchemy2 import Geometry
from geoalchemy2.comparator import Comparator
from sqlalchemy import text, exc
from sqlalchemy.sql import func, cast
from sqlalchemy.dialects.postgresql import UUID, JSON

from app import db


class Places(db.Model):
    uuid = db.Column(UUID(as_uuid=True),
                     primary_key=True,
                     server_default=text("uuid_generate_v4()"))
    name = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now())
    aqi = db.Column(db.Integer, nullable=False)
    # 4326: projection defines lat/long coordinate system
    geometric_point = db.Column(
        Geometry(geometry_type='POINT', srid=4326), nullable=False)
    # Raw location
    location = db.Column(JSON, nullable=False)
    # History Data id: Can be null but must be unique
    ref_id = db.Column(db.String(40), unique=True, nullable=True)

    # method tells Python how to print objects of this class
    def __repr__(self):
        return '<Location {}>'.format(self.name)

    def get_nearby_aqi_node(lat, lng):
        # ToDo: Refactor to be more precise: https://stackoverflow.com/a/20936147
        dist_in_meters = 1500
        dist_in_miles = dist_in_meters * 0.621371192 / 1000
        dist_in_degree_radius = dist_in_miles * 0.014472

        # load longitude & latitude
        geo_point = func.ST_GeographyFromText('POINT({} {})'.format(lng, lat))
        # Well-Known Binary format
        geo_wkb = func.Geometry(geo_point)

        # get closest point
        try:
            # `distance_centroid` will do an index based Nearest Neighbour (NN) search.
            nearby_point = db.session.query(Places.name,
                                            Places.aqi,
                                            Places.location,
                                            Places.updated_at).\
                filter(func.ST_DFullyWithin(Places.geometric_point, geo_wkb, dist_in_degree_radius)).\
                order_by(
                Comparator.distance_centroid(Places.geometric_point, geo_wkb)).limit(1).first()

            if (nearby_point is not None):
                place_object = {
                    'name': nearby_point[0],
                    'aqi': nearby_point[1],
                    'location': nearby_point[2],
                    'updated_at': nearby_point[3]
                }

                return place_object
            return None
        except exc.SQLAlchemyError:
            return None
        except Exception as err:
            print('Unknown error', err)
            return None