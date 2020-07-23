FROM postgis/postgis
# https://stackoverflow.com/q/60329587
# FROM postgres:12.3-alpine

# Copy in the load-extensions script
# See `Initialization scripts` section in https://hub.docker.com/_/postgres
COPY load-extensions.sh /docker-entrypoint-initdb.d/