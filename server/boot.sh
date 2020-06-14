#!/bin/bash
# this script is used to boot a Docker container
while true; do
    # Upgrade the database though the migration framework
    flask db upgrade
    if [[ "$?" == "0" ]]; then
        break
    fi
    echo Upgrade command failed, retrying in 5 secs...
    sleep 5
done
# Run the server with gunicorn.
exec gunicorn -b 0.0.0.0:5001 --access-logfile - --error-logfile - 'run:create_app()'