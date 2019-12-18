from flask import Flask
from app.extensions import db, migrate

from app import models
from config import Config


def create_app():
    flask_app = Flask(__name__)
    flask_app.config.from_object(Config)

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
    from app.api import bp as api_bp
    flask_app.register_blueprint(api_bp)


def register_shellcontext(flask_app):
    """Register shell context objects.
       Creates a shell context that adds the database
       instance and models to the shell session
    """
    def make_shell_context():
        """Shell context objects."""
        return {
            'db': db,
            'Location': models.Location
        }

    flask_app.shell_context_processor(make_shell_context)
