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
ENV LRUN_VERSION 1.1.4
ENV DEBIAN_FRONTEND noninteractive

# RUNTIME DEPENDENCIES
RUN apt-get install -y apt-utils
RUN apt-get install -y libseccomp2 libgomp1
RUN apt-get install -y zip pkg-config g++ rake build-essential
RUN apt-get install -y wget
RUN touch /usr/include/stropts.h

#RUN wget "https://github.com/quark-zju/lrun/releases/download/v${LRUN_VERSION}/lrun_${LRUN_VERSION}_amd64.deb" && \
#    dpkg -i "lrun_${LRUN_VERSION}_amd64.deb" && \
#    rm -f "lrun_${LRUN_VERSION}_amd64.deb"
RUN mkdir -p /TMP
RUN cd /TMP && \
    wget "https://github.com/quark-zju/lrun/archive/master.zip" && \
    unzip master.zip && \
    cd lrun-master && \
    make install && \
    rm -rf /TMP/lrun-master /TMP/master.zip


# CLEAN PACKAGE ARCHIVES
RUN apt-get clean && \
    rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

ENV LJUDGE_VERSION=0.6.1

# INSTALL LJUDGE BINARY
RUN cd /TMP && \
    wget "https://github.com/quark-zju/ljudge/archive/master.zip" && \
    unzip master.zip && \
    cd ljudge-master/src && \
    make install && \
    cd .. && \
    cp -R etc/ljudge /usr/bin/ljudge && \
    rm -rf /TMP

# ADD NON-ROOT USER
ENV USERNAME ljudge
RUN groupadd $USERNAME \
  && useradd --gid $USERNAME --shell /bin/bash --create-home $USERNAME

# CONFIGURATION FOR RUNNING LRUN
RUN gpasswd -a $USERNAME lrun
USER $USERNAME
RUN ljudge --check
RUN lrun --debug echo foo
################################### judge plugin installed ####################################


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN root

RUN mkdir -p /data/target

RUN npm install npm@latest -g
RUN npm install nodemon -g
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]