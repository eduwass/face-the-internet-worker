# face-the-internet-worker
Node.js - Python - Hello world app on Ubuntu using Docker

Start Docker VM
`boot2docker up`

Build docker image from dockerfile:
`docker build -t eduwass/face-the-internet-worker .`

List Docker images:
`docker images`

Run created image in docker container
`docker run -t -i eduwass/face-the-internet-worker`
