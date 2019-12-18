from app import create_app

flask_app = create_app()

if __name__ == '__main__':
    flask_app.run(host=flask_app.config["FLASK_RUN_HOST"],
                  debug=flask_app.config["FLASK_DEBUG"], port=flask_app.config["FLASK_RUN_PORT"])
