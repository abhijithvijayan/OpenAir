# flask app

## Prerequisites

- Postgresql

```
sudo apt update
sudo apt install postgresql postgresql-contrib postgresql-10-postgis-scripts
```

### Create Database and Use Extensions

```
createdb db_name

psql -d db_name

CREATE EXTENSION postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
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
