---
layout: page
title: Mac
exclude_from_search: true
---

Some useful how-to's and tricks regarding macOS.

# Install GNURadio on OSX El Capitan

``` shell
brew install cmake; brew unlink cmake
cd /usr/local/Library
git checkout -b cmake 0036e3d1
brew install cmake; brew switch cmake 3.3.2
git checkout master
brew install gnuradio
```


http://coolestguidesontheplanet.com/how-to-write-to-ntfs-external-disk-drives-from-os-x-10-11-el-capitan/
