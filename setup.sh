#!/bin/bash

# Dotfiles
if [[ ! -L /home/comma/.kfc ]]; then
  if [[ -d /home/comma/.kfc ]]; then
    rm -rf /home/comma/.kfc
  fi
  if [[ ! -d /data/media/developer/.kfc ]]; then
    git clone https://github.com/kfatehi/dotconf /data/media/developer/.kfc
    ln -sf /data/media/developer/.kfc /home/comma/.kfc
    cd /home/comma/.kfc && ./bootstrap
  fi
else
  arr=(vim vimrc tmux.conf)
  for i in "${arr[@]}"; do
    if [[ ! -L /home/comma/.$i ]]; then
      if [[ -f /home/comma/.$i || -d /home/comma/.$1 ]]; then
        mv /home/comma/.$i /home/comma/.$i.backup
      fi
      ln -sf /data/media/developer/.kfc/dotfiles/$i /home/comma/.$i
    fi
  done
fi

# VScode
if [[ ! -L /home/comma/.vscode-server ]]; then
  if [[ -d /home/comma/.vscode-server ]]; then
    rm -rf /home/comma/.vscode-server
  fi
  mkdir -p /data/media/developer/vscode-server
  ln -sf /data/media/developer/vscode-server /home/comma/.vscode-server
fi

# Git identity
git config --global user.email "keyvanfatehi@gmail.com"
git config --global user.name "Keyvan Fatehi"

# Seethru transform toy
#cat  /data/media/developer/transform.json  > /dev/shm/transform.json

# Pip stuff
mkdir -p /data/media/developer/pip/tmp
mkdir -p /data/media/developer/pip/cache
cat <<EOF > /data/media/developer/pip/env
export TMPDIR=/data/media/developer/pip/tmp
export PIP_TARGET=/data/openpilot/pyextra
export PIP_CACHE_DIR=/data/media/developer/pip/cache
EOF

echo "If you want to install stuff persistently with pip you can first run:"
echo "   . /data/media/developer/pip/env"
echo ""
echo "If you need to write to root for some reason you can run:"
echo "   sudo mount -o remount,rw /"
echo ""
echo "Put it back like so after making your changes:"
echo "   sudo mount -o remount,ro /"

# Streamer requirements
# sudo apt update
# sudo apt install -y libopus-dev libvpx-dev
# pip install av aiortc aiohttp websockets
