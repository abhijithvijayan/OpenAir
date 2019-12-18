from app import create_app, db
from app.models import Location

app = create_app()


"""
Creates a shell context that adds the database instance and models to the shell session
"""
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Location': Location}


if __name__ == '__main__':
    app.run(host=app.config["FLASK_RUN_HOST"],
            debug=app.config["FLASK_DEBUG"], port=app.config["FLASK_RUN_PORT"])
