# Use LTS Node environment as build environment
FROM node:carbon AS builder

# Initialize working directory
RUN mkdir -p /app
WORKDIR /app
ADD . /app

# Install necessary dependancies
RUN yarn install

# Configure deployment environment
#ENV NODE_ENV=development
#ENV NODE_ENV=production

# Build application
RUN yarn run build

# Use Nginx server to serve 'build' directory
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build/ .

EXPOSE 80