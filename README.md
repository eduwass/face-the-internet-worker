# face-the-internet-worker

#### Intro
This repo will contain all setup and code of the worker box for the face-the-internet project.
This box is only responsable of getting images and processing them.

##### Stack
* **Docker**: VM wrapper, the `Dockerfile` contains the definition of the whole system 
(base OS, all required libraries and packages, setup commands) 
* **Python**: we're using some image procesing scripts that are built in Python, 
we want to make them accessible to Node so we're using the `python-shell` npm module to achieve that
* **NodeJS**: main processing is handled by Node, it should listen to POST requests coming from the *client*
and them trigger some actions
* **GraphicsMagick and ImageMagick for node.js**: the 'gm' npm package. Image processing tools for node.js
* **Other libs**: OpenCV, NumPy, Matplotlib, Stasm


#### Start Docker VM Container
`docker-machine create --driver virtualbox dev`

#### Set needed Docker env vars
`eval "$(docker-machine env dev)"`

####  Run
So what you want to do now, is to build an image into your VM container using our `Dockerfile`.

To be able to develop and test, you'll also want to run it while mapping `/app` to your local copy of the repo, 
this way your local changes to the code are reflected to the VM container:

`docker run -v $HOME/Sites/face-the-internet-worker:/app -t -i eduwass/face-the-internet-worker`

This will build the image using the latest `Dockerfile` found in the GitHub repo.
If it's the first time you are building the Docker image this will take a while (around 20 mins).

**Note**: If you make changes to Dockerfile you'll want to rebuild, to do that, remove the image with:
`docker rmi --force eduwass/face-the-internet-worker`
And then do the previous `docker run` command again to rebuild from updated `Dockerfile`.

#### It's running!
If you followed the previous steps you should hopefully end up in a terminal inside the Docker VM Container.
You'll prompt will look something like this:

`root@3176dbf24add:~#`

From here you can cd into the `/app` folder and test run any NodeJS or Python, like:

* `node index.js`
* `python facemorpher/morpher.py --src=examples/face1.jpg --dest=examples/face2.jpg --num=12 --plot`

#### Just want to build the Docker Image
To build Docker Image from `Dockerfile`:

`docker build -t eduwass/face-the-internet-worker .`
