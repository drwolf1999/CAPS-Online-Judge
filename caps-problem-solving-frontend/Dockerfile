# Create the container from the alpine linux image
FROM alpine:3.12.0

# Add nginx and nodejs
RUN apk add --update nginx nodejs npm

# Create the directories we will need
RUN mkdir -p /tmp/nginx/vue-single-page-app
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html

# Copy the respective nginx configuration files
COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf

# Set the directory we want to run the next commands for
WORKDIR /tmp/nginx/vue-single-page-app

COPY package*.json ./

# Install the dependencies, can be commented out if you're running the same node version
# RUN npm i npm@latest -g
RUN npm install

RUN npm install @vue/cli -g
RUN npm install @vue/cli-service-global -g

# Copy our source code into the container
COPY . .

# run webpack and the vue-loader
RUN npm run build

# copy the built app to our served directory
RUN /bin/cp -r dist/* /var/www/html

# make all files belong to the nginx user
RUN chown nginx:nginx /var/www/html

EXPOSE 80

# start nginx and keep the process from backgrounding and the container from quitting
CMD ["nginx", "-g", "daemon off;"]