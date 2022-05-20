# Install
1. Generate ssh key
```
ssh-keygen -f /data/ssh/id_rsa
```
2. Reveal the public key and then add it to github https://github.com/settings/ssh/new
```
cat /data/ssh/id_rsa.pub
```
3. Clone into /data/media/developer
```
git clone git@github.com:kfatehi/tici-developer-setup /data/media/developer
```
4. Add to the end of /etc/profile
```
sudo mount -o remount,rw /
echo "source /data/media/developer/setup.sh" >> /etc/profile
sudo mount -o remount,ro /
```
