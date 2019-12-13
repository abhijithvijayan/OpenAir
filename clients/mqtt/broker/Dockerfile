FROM node:8

# Setting working directory.
WORKDIR /app

# Install missing dependency
RUN apt-get update && apt-get install libzmq3-dev -y
# Install yarn
RUN npm install -g yarn
# Install Nodemon
RUN npm install -g nodemon

# Installing dependencies
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

# Copying source files
COPY . /app

# Port exposed by docker
EXPOSE 8888

# Running the app
CMD [ "yarn", "broker" ]