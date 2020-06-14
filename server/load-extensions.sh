#!/bin/sh
# This script is used to create extensions in database
# After the entrypoint calls initdb to create the default postgres user and database,
# it will run any *.sql files, run any executable *.sh scripts, and source any non-executable *.sh
# scripts found in that directory to do further initialization before starting the service.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT * FROM pg_extension;
EOSQL