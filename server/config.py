import os
from dotenv import load_dotenv

APP_ROOT = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(APP_ROOT, '.env')

# import .env file, so the variables are set when the class is constructed
load_dotenv(dotenv_path)


class Config(object):
  # ...
