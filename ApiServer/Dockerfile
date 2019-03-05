# Use LTS Node environment as build environment
FROM node:carbon AS builder

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

# Serve application
ENTRYPOINT ["yarn", "start"]
EXPOSE 3001

