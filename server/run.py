from app import create_app, db
from app.models import Location

flask_app = create_app()

"""
Creates a shell context that adds the database instance and models to the shell session
"""
@flask_app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Location': Location}


if __name__ == '__main__':
    flask_app.run(host=flask_app.config["FLASK_RUN_HOST"],
                  debug=flask_app.config["FLASK_DEBUG"], port=flask_app.config["FLASK_RUN_PORT"])
