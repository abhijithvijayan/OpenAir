from datetime import datetime
from geoalchemy2 import Geometry
from sqlalchemy import text
from sqlalchemy.sql import func
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
