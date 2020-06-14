# pull official base image
FROM python:3.8.3-buster

# Working directory
WORKDIR /usr/src/app

# Environment variables
# prevents Python from writing pyc files to disc (equivalent to python -B option)
ENV PYTHONDONTWRITEBYTECODE 1
# prevents Python from buffering stdout and stderr (equivalent to python -u option)
ENV PYTHONUNBUFFERED 1

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
# add Gunicorn, a production-grade WSGI server
RUN pip install gunicorn

# copy source
COPY app app
COPY migrations migrations
COPY  config.py run.py boot.sh ./
# Add execute permission for boot script
RUN chmod +x boot.sh