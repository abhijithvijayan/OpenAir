# mqtt broker

Build docker container image

```
docker build -t broker .
```

To run docker in interactive mode

```
docker run -it -p 8888:1883 broker
```

Run docker with `nodemon` watch

```
docker run -it -p 8888:1883 -v $(pwd):/app broker
```

To run docker in detached mode

```

docker run -d -p 8888:1883 broker

```

List all docker processes running

```

docker ps

```

List all docker images

```

docker image ls

```

```

```
