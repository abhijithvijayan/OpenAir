from flask.helpers import get_debug_flag

from app import create_app
from config import DevConfig, ProdConfig

CONFIG = DevConfig if get_debug_flag() else ProdConfig


if __name__ == '__main__':
    flask_app = create_app(CONFIG)

    flask_app.run(host=flask_app.config["FLASK_RUN_HOST"],
                  debug=flask_app.config["FLASK_DEBUG"],
                  port=flask_app.config["FLASK_RUN_PORT"])
