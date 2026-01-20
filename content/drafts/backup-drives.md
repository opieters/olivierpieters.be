---
layout: post
title:  A Distributed Backup Solution with Raspberry Pi and Syncthing
tags:   [backup, Raspberry Pi, Syncthing]
draft: true
---

Backing up content is not one of the must exciting things, but keeping your data safe is important. The chances of having a hard drive fail, are small, but this chance is not zero. It is thus important to keep at least one copy of vital data since hardware (no matter the cost) can always be replaced, but the data can't.

Keeping a backup at the same location as the original drive is good, but won't protect against natural disasters (fire, flood...). An off-site backup is the solution. There are several online services where you can store your data, but I like to keep my data out of the (possibly unsafe) cloud and have full control over it. For this reason I created this custom Raspberry Pi based backup solution. The main prerequisite is that you have two locations where you can keep the data.

This tutorial will only work in Mac/Linux. Windows users can execute all the commands from a Linux VM or from one of their Raspberry Pis.

## Where to Start

Because I had already quite a lot of data on my drive, I first synched my two drives (the other drive is forcefully mirrored to the initial drive, all non-duplicate data) is removed (set correct directories):

{{< highlight bash >}}
rsync -aE –delete /path/to/source/folder/ /path/to/destination/folder/
{{< /highlight >}}

After syncing the drives, we will setup the Pis. Start by downloading the latest version of Raspberian from the [Raspberry Pi Website][download-raspberian]. I downloaded the NOOBS software and connected a display and monitor for convenience, but you can also [install Raspberrian directly][install-raspberian-no-screen]. It is advised to directly boot into the shell because your Pi will normally not be running with a screen/keyboard connected.

After installing, we will update the system. Run `sudo apt-get update` and `sudo apt-get upgrade` from the terminal. It is a good idea to exchange SSH keys after this update. The [official raspberry pi documentation][official-ssh] has a very good guide about how to do this. If we do this, there will be no more need to enter the password when logging in.

We will use Syncthing to sync the drives. A simple `apt-get` will not work. We will first need to add the repository with:

{{< highlight bash >}}
wget -O - https://syncthing.net/release-key.txt | sudo apt-key add -
echo "deb http://apt.syncthing.net/ syncthing release" | sudo tee -a /etc/apt/sources.list.d/syncthing-release.list
{{< /highlight >}}

After registering the location of the binaries in ourt local apt-get installation, we can install Syncthing with the usual command: `sudo apt-get install syncthing`.

## Setting Up Syncthing

Now we must configure Syncthing to allow external hosts (on the same network off course) to edit settings in the web UI. To this end, we must edit the configuration file on the Raspberry Pi. Open the file in `~/.config/syncthing/config.xml` with your favourite text editor (e.g. `nano` or `pico`) and change the address from `127.0.0.1` to `0.0.0.0` (localhost to any host). The transofmration is illustrated below:


<div class="row">
<div class="center-element half-width">

{{< highlight xml >}}
<gui enabled="true" tls="false">
    <address>127.0.0.1:8384</address>
</gui>
{{< /highlight >}}

</div>
<div class="center-element half-width">
<p>becomes:</p>
{{< highlight xml >}}
<gui enabled="true" tls="true">
    <address>0.0.0.0:8384</address>
</gui>
{{< /highlight >}}
</div>
</div>

In the above snippet, we also enabled a secure TLS connection. This is not required for the rest of the setup/guide.

Now we will set a password and admin user. Open the web UI on address `https://raspberrypi.local:8384` (Bonjour from Apple is required). Then go to
Actions > Settings and set a GUI Authentication User and GUI Authentication Password also make sure HTTPS, UPnP, Local/Global Discovery and Relaying are enabled. I also limited the incoming and outgoing rates to 1MiB/s, but this is optional.

## Adding the HDD

Start by installing the necessary tools for NTFS (Windows) and HFS+ (Mac) drives:

```
sudo apt-get update
sudo apt-get install ntfs-3g hfsprogs gdisk
```

Then detect the drive by running `sudo blkid`. The output should be similar to:

```
/dev/sda2: UUID="bf41f9e1-66f5-3f99-af64-23f20e4ab1b9" LABEL="Western Digital HD" TYPE="hfsplus" PARTLABEL="Western Digital HD" PARTUUID="c4854b02-0b00-4cd7-a084-26ab09e8bed9"
```

If your drive is not listed, check if it was attached correclty and that it does not use too much power (older Raspberry Pi models might not function very well with USB powered drives. Consider buying an externally powered USB hub.).

After making sure the drive is detectable, we must check the permissions:

```
sudo fdisk -l
```

The output will be similar to this

```
# more output
Disk /dev/sda: 1.8 TiB, 2000365289472 bytes, 3906963456 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 0A3C111D-D53E-4AE3-9ED4-90276B2F5021

Device      Start        End    Sectors  Size Type
/dev/sda1      40     409639     409600  200M EFI System
/dev/sda2  409640 3906701271 3906291632  1.8T Apple HFS/HFS+
```

If you have multiple drives connected, it is best to do the above drive by drive, because the UUID and labels are not displayed by `fdisk`. My drive is located at `/dev/sda2`

Now we can mount the drive to a specific directory. First we will create the directory, then we will mount the drive to this directory.

```
sudo mkdir /media/backup
sudo mount -t hfsplus -o force,rw /dev/sda2 /media/backup
```

After mounting the drive, we will set permissions properly to enable read/write without requiring the user user (`sudo`):

```
sudo chmod a=rwx /media/backup/
```
(anyone read, write. execute)
Check if it is working by creating a file with `nano`:

```
cd /media/backup
nano test-file.txt
```

Then enter something and try saving the file (`Kust ze!`).

Finally we need to do a automate the mounting procedure. To this end, edit the `fstab` file:

```
sudo nano /etc/fstab
```

Then add the following line (use spaces as separators):

```
/dev/sda2 /media/backup hfsplus defaults,force 0 0
```

(force mount, as before and with default options. The two zeros say specify if the drive will be checked on boot, and if so in which order. Finally, I saved this file, and rebooted.)

If any problems occur, run this command:

```
sudo fsck.hfsplus /dev/sda2
```

Reboot your Raspberry Pi and check if the drive is mounted with `cat /proc/mounts` and again try creating a file in the driecory of the drive.

To unmount, run: `umount -t hfsplus /dev/sda2`

Sources:

[source1](http://www.php5dp.com/change-file-permissions-on-raspberry-pi-a-mini-post/)
[source2](http://www.modmypi.com/blog/how-to-mount-an-external-hard-drive-on-the-raspberry-pi-raspian)
[source3](https://raspberrypibeginner.wordpress.com/2013/03/05/mounting-hfs-from-mac-to-rpi/)
[source4](http://superuser.com/questions/84446/how-to-mount-a-hfs-partition-in-ubuntu-as-read-write)


## Autostart Syncthing

After installing and setting up the drive, we will add a script to the boot sequence to automatically start Syncthing. Start by creating a `syncthing` startup file:

{{< highlight bash >}}
sudo nano /etc/init.d/syncthing
{{< /highlight >}}

Then past the following content (if you are not using the default `pi` user, change the `DAEMON_NAME` to your default user!):

{{< highlight bash >}}
sudo nano /etc/init.d/syncthing
{{< /highlight >}}

Then close this file and make it executable:

```
sudo chmod +x /etc/init.d/syncthing
```

Finally we need to add the script to our boot sequence:

```
sudo update-rc.d syncthing defaults
```

Syncthing will now automatically start the next time your boot into the `pi` user. To force a start right now, use:

```
sudo service syncthing start
```

{{/* id: opieters pwd: syncoli94 */}}

http://www.modmypi.com/blog/how-to-mount-an-external-hard-drive-on-the-raspberry-pi-raspian

http://www.pebra.net/blog/2015/08/23/syncthing/

http://www.htpcguides.com/install-syncthing-raspberry-pi-bittorrent-sync-alternative/

[download-raspberian]: https://www.raspberrypi.org/downloads/
[official-ssh]: https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md
[install-raspberian-no-screen]: https://sendgrid.com/blog/complete-guide-set-raspberry-pi-without-keyboard-mouse/
