#
# Ubuntu Dockerfile
#
# https://github.com/dockerfile/ubuntu
#

# Pull base image.
FROM ubuntu:14.04

# Install.
RUN sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get install -y build-essential
RUN apt-get install -y software-properties-common
RUN apt-get install -y byobu curl git htop man unzip vim wget
RUN wget -O- http://neuro.debian.net/lists/trusty.de-m.full | sudo tee /etc/apt/sources.list.d/neurodebian.sources.list
RUN sudo apt-key adv --recv-keys --keyserver hkp://pgp.mit.edu:80 0xA5D32F012649A5A9
RUN apt-get install -y gcc make cmake pkg-config python python-dev python-pip python-virtualenv libopencv-dev
RUN apt-get install -y libopenblas-dev python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose python-opencv
RUN apt-get install -y libfreetype6-dev libpng-dev
RUN apt-get install -y imagemagick graphicsmagick
RUN rm -rf /var/lib/apt/lists/*
# install requirements

# pip
RUN pip install cv2
#RUN pip install numpy
#RUN pip install matplotlib
RUN pip install docopt
#RUN pip install cython git+https://github.com/scipy/scipy
#RUN pip install git+https://github.com/scipy/scipy.git
#RUN pip install Pillow

# Install Node.js
RUN \
  cd /tmp && \
  wget http://nodejs.org/dist/node-latest.tar.gz && \
  tar xvzf node-latest.tar.gz && \
  rm -f node-latest.tar.gz && \
  cd node-v* && \
  ./configure && \
  CXX="g++ -Wno-unused-local-typedefs" make && \
  CXX="g++ -Wno-unused-local-typedefs" make install && \
  cd /tmp && \
  rm -rf /tmp/node-v* && \
  npm install -g npm && \
  printf '\n# Node.js\nexport PATH="node_modules/.bin:$PATH"' >> /root/.bashrc

# Add files.
ADD . /app

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

RUN sudo ln /dev/null /dev/raw1394

# Define default command.
CMD ["bash"]