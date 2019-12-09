from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host=app.config["FLASK_RUN_HOST"],
            debug=app.config["FLASK_DEBUG"], port=app.config["FLASK_RUN_PORT"])
