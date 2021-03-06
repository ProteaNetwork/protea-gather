# Use LTS Node environment as build environment
FROM node:carbon AS builder

ARG NODE_OPTIONS
ARG API_HOST
ARG API_SCHEMA=https

ARG MAINNET_DAI_ADDRESS
ARG RINKEBY_DAI_ADDRESS
ARG GOERLI_DAI_ADDRESS
ARG KOVAN_DAI_ADDRESS
ARG ROPSTEN_DAI_ADDRESS

ARG MAINNET_COMMUNITY_FACTORY_ADDRESS
ARG RINKEBY_COMMUNITY_FACTORY_ADDRESS
ARG GOERLI_COMMUNITY_FACTORY_ADDRESS
ARG KOVAN_COMMUNITY_FACTORY_ADDRESS
ARG ROPSTEN_COMMUNITY_FACTORY_ADDRESS

# Initialize working directory
RUN mkdir -p /app/WebApp
RUN mkdir -p /app/Blockchain/build
RUN mkdir /temp

ADD ./WebApp /app/WebApp
ADD ./yarn.lock /app/WebApp/yarn.lock
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
