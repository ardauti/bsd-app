# Alpine Linux is a security-oriented, lightweight (~5Mb) Linux distribution. 
FROM node:alpine as build

# Env
ENV VITE_BASE_URL=https://gateway.salmonsea-2b5f480f.westeurope.azurecontainerapps.io/

# Set working directory
WORKDIR /app

# Add the node_modules folder to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json
COPY ./package.json /app/

# Install  dependencies
RUN yarn install

RUN npm install @mui/material @emotion/react @emotion/styled elements-x mapbox-gl

# copy everything to /app directory
COPY . /app

# Build the app
RUN yarn build

FROM nginx:alpine as server

# Copy from the build
COPY --from=build /app/dist /var/www

# Copy nginx
COPY docker/nginx/app.conf /etc/nginx/conf.d/default.conf

# Expose   ports
EXPOSE 80 443

# Run NGINX
CMD ["nginx", "-g", "daemon off;"]
