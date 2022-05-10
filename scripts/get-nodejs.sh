#!/bin/bash
NODE_VERSION=18.1.0
mkdir -p /data/media/developer/usr/local && \
  cd /data/media/developer/tmp && \
  curl -sSLO https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-arm64.tar.gz && \
  tar -C /data/media/developer/usr/local --strip-components 1 -xzf node-v$NODE_VERSION-linux-arm64.tar.gz && \
  rm node-v$NODE_VERSION-linux-x64.tar.gz
