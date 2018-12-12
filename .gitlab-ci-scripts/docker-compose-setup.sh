#!/bin/bash -ex

docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN registry.gitlab.com \
    && apk add --no-cache py-pip \
    && pip install docker-compose