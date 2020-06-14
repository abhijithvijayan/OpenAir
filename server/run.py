from flask.helpers import get_debug_flag

from config import DevConfig, ProdConfig
from app.factory import create_app

CONFIG = DevConfig if get_debug_flag() else ProdConfig


if __name__ == '__main__':
    flask_app = create_app(CONFIG)

    flask_app.run(host=flask_app.config["FLASK_RUN_HOST"],
                  debug=flask_app.config["FLASK_DEBUG"],
                  port=flask_app.config["FLASK_RUN_PORT"])
