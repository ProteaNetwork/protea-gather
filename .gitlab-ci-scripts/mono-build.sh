#!/bin/bash -ex

cd Blockchain
yarn
yarn build

cd ../
yarn
yarn build