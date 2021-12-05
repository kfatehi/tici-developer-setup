#!/bin/bash
# VScode
if [[ ! -L /home/comma/.vscode-server ]]; then
  if [[ -d /home/comma/.vscode-server ]]; then
    rm -rf /home/comma/.vscode-server
  fi
  ln -sf /data/media/developer/vscode-server /home/comma/.vscode-server
fi

# Git identity
git config --global user.email "keyvanfatehi@gmail.com"
git config --global user.name "Keyvan Fatehi"

# Seethru transform toy
#cat  /data/media/developer/transform.json  > /dev/shm/transform.json

# Pip stuff
mkdir -p /data/media/developer/pip/tmp
mkdir -p /data/media/developer/pip/target
mkdir -p /data/media/developer/pip/cache
cat <<EOF > /data/media/developer/pip/env
export TMPDIR=/data/media/developer/pip/tmp
export PIP_TARGET=/data/media/developer/pip/target
export PIP_CACHE_DIR=/data/media/developer/pip/cache
export PYTHONPATH="\$PIP_TARGET:\$PYTHONPATH"
EOF
echo "If you want to install stuff with pip run:"
echo "   sudo mount -o remount,rw /"
echo "   . /data/media/developer/pip/env"

# Streamer requirements
# sudo apt update
# sudo apt install -y libopus-dev
# pip install av aiortc