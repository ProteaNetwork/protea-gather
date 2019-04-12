# Use LTS Node environment as build environment
FROM node:carbon AS builder

# Initialize working directory
RUN mkdir -p /app/ApiServer
RUN mkdir -p /app/Blockchain/build
RUN mkdir /temp

ADD ./ApiServer/ /app
ADD ./Blockchain/ /temp

WORKDIR /temp
RUN yarn
RUN yarn build
RUN cp -r /temp/build/. /app/Blockchain/build
RUN rm -rf /temp

WORKDIR /app/ApiServer

# Install necessary dependancies
RUN yarn

# Configure deployment environment
#ENV NODE_ENV=development
#ENV NODE_ENV=production

# Build application
RUN yarn build

# Serve application
ENTRYPOINT ["yarn", "start"]
EXPOSE 3001

