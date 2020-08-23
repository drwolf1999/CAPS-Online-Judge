FROM ubuntu:20.04

# UPDATE REPOSITORIES
RUN apt-get update && apt-get upgrade -y
RUN apt-get install software-properties-common curl sudo -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install dialog apt-utils -y
RUN apt-get update && apt-get upgrade -y
RUN apt-get install nodejs -y
RUN apt-get install -y git python3 rake g++ cmake

##################################### install judge supporter #################################
ENV DEBIAN_FRONTEND noninteractive

# RUNTIME DEPENDENCIES
RUN apt-get install -y apt-utils
RUN apt-get install -y libseccomp-dev libseccomp2 libgomp1
RUN apt-get install -y pkg-config g++ rake build-essential python3 python3-pip
RUN apt-get install -y wget
RUN touch /usr/include/stropts.h

RUN mkdir -p /TMP
RUN cd /TMP && \
    git clone https://github.com/QingdaoU/Judger.git && \
    cd Judger && \
    mkdir build && \
    cd build && \
    cmake .. && \
    make && \
    sudo make install && \
    rm -rf /TMP/Judger-master /TMP/master.zip

RUN pip3 install pyinstaller

################################### judge plugin installed ####################################


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

USER root

RUN mkdir -p /data/target
RUN mkdir -p /data/log

RUN npm install npm@latest -g
RUN npm install nodemon -g
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN mkdir /judge
RUN mv /usr/src/app/Checker/* /judge
RUN make -C /judge/ all

EXPOSE 3000

CMD ["npm", "start"]