# flask app

## Prerequisites

- Postgresql

```
sudo apt update
sudo apt install postgresql postgresql-contrib postgresql-10-postgis-scripts
```

### Install dependencies

```
pipenv install
```

### Generate environment on another machine

1. List all the dependencies to a file

```
pip freeze > requirements.txt
```

2. Install from `requirements.txt` file

```
pip install -r requirements.txt
```
