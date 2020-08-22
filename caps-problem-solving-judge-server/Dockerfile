FROM ubuntu:20.04

# UPDATE REPOSITORIES
RUN apt-get update && apt-get upgrade -y
RUN apt-get install software-properties-common curl sudo -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install dialog apt-utils -y
RUN apt-get update && apt-get upgrade -y
RUN apt-get install nodejs -y

##################################### install judge supporter #################################
ENV LRUN_VERSION 1.1.4

# RUNTIME DEPENDENCIES
RUN apt-get install -y apt-utils
RUN apt-get install -y libseccomp2 libgomp1
RUN apt-get install -y wget

RUN wget "https://github.com/quark-zju/lrun/releases/download/v${LRUN_VERSION}/lrun_${LRUN_VERSION}_amd64.deb" && \
    dpkg -i "lrun_${LRUN_VERSION}_amd64.deb" && \
    rm -f "lrun_${LRUN_VERSION}_amd64.deb"

# CLEAN PACKAGE ARCHIVES
RUN apt-get clean && \
    rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

ENV LJUDGE_VERSION=0.6.1

# INSTALL LJUDGE BINARY
RUN wget "https://github.com/quark-zju/ljudge/releases/download/v${LJUDGE_VERSION}/ljudge_${LJUDGE_VERSION}_amd64.deb" && \
    dpkg -i "ljudge_${LJUDGE_VERSION}_amd64.deb" && \
    rm -f "ljudge_${LJUDGE_VERSION}_amd64.deb"

# ADD NON-ROOT USER
ENV USERNAME ljudge
RUN groupadd $USERNAME \
  && useradd --gid $USERNAME --shell /bin/bash --create-home $USERNAME

# CONFIGURATION FOR RUNNING LRUN
RUN gpasswd -a $USERNAME lrun
USER $USERNAME
RUN /bin/sh -c /usr/bin/lrun --debug echo foo
################################### judge plugin installed ####################################


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

USER root

RUN npm install npm@latest -g
RUN npm install nodemon -g
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]