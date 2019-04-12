# Use LTS Node environment as build environment
FROM node:carbon AS builder

ARG NODE_OPTIONS
ARG API_HOST
ARG API_SCHEMA

# Initialize working directory
RUN mkdir -p /app/WebApp
RUN mkdir -p /app/Blockchain/build
RUN mkdir /temp

ADD ./WebApp /app/WebApp
ADD ./Blockchain /temp

WORKDIR /temp
RUN yarn
RUN yarn build
RUN cp -r /temp/build/. /app/Blockchain/build
RUN rm -rf /temp

WORKDIR /app/WebApp

# Install necessary dependancies
RUN yarn

# Configure deployment environment
#ENV NODE_ENV=development
#ENV NODE_ENV=production

# Build application
RUN yarn build

# Use Nginx server to serve 'build' directory
FROM nginx:alpine

COPY --from=builder /app/WebApp/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/WebApp/build/ .

EXPOSE 80
