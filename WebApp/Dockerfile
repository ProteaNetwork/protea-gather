# Use LTS Node environment as build environment
FROM node:carbon AS builder

ARG API_HOST
ARG API_SCHEMA

# Initialize working directory
RUN mkdir -p /app
WORKDIR /app
ADD . /app

# Install necessary dependancies
RUN yarn

# Configure deployment environment
#ENV NODE_ENV=development
#ENV NODE_ENV=production

# Build application
RUN yarn build

# Use Nginx server to serve 'build' directory
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build/ .

EXPOSE 80
