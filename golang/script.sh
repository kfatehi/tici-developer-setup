#!/bin/bash
set -euxo pipefail
dest=/data/media/developer/golang
mkdir -p $dest
tarball=go1.19.3.linux-arm64.tar.gz
curl -sSLO https://go.dev/dl/$tarball
sudo rm -rf $dest/go && sudo tar -C $dest -xzf $tarball
