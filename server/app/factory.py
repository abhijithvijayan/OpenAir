from flask import Flask

from app.extensions import db, migrate
from config import ProdConfig
from app import models, api


def create_app(config_object=ProdConfig):
    flask_app = Flask(__name__)
    flask_app.config.from_object(config_object)

    register_extensions(flask_app)
    register_blueprints(flask_app)
    register_shellcontext(flask_app)

    return flask_app


def register_extensions(flask_app):
    """Register Flask extensions."""
    db.init_app(flask_app)
    migrate.init_app(flask_app, db)


def register_blueprints(flask_app):
    """Register Flask blueprints."""
    flask_app.register_blueprint(api.bp)


def register_shellcontext(flask_app):
    """Register shell context objects.
       Creates a shell context that adds the database
       instance and models to the shell session
    """
    def make_shell_context():
        """Shell context objects."""
        return {
            'db': db,
            'Place': models.Place
        }

    flask_app.shell_context_processor(make_shell_context)
