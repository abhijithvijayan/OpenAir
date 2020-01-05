import os
from dotenv import load_dotenv

APP_ROOT = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(APP_ROOT, '.env')

# import .env file, so the variables are set when the class is constructed
load_dotenv(dotenv_path)


class Config(object):
    """Base configuration."""

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

    CIRCULAR_COVERAGE_DISTANCE_FROM_NODE = os.environ.get(
        'CIRCULAR_COVERAGE_DISTANCE_FROM_NODE')
    THRESHOLD_DISTANCE_BETWEEN_LEGS = os.environ.get(
        'THRESHOLD_DISTANCE_BETWEEN_LEGS')


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    DEBUG = False


class DevConfig(Config):
    """Development configuration."""

    ENV = 'dev'
    DEBUG = True
