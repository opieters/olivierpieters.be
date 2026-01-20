---
layout: post
title:  Setting Up My VPS
date:   "2016-08-11T10:40:00+02:00"
tags:   [VPS, self-hosted, website, email, Piwik, SSH, Debian]
draft: true
---

Recently I decided to switch from shared hosting to VPS for a number of reasons. The main reasons were: I wanted full SSH root access, possibility to run ownCloud, Gogs and others and possibility experiment with some cloud CI and this all over SSL. This was not possible with my current hosting option, so I investigated on how to setup a VPS. I decided to go for a {{< blank_url "RamNode" "http://ramnode.com">}} VPS.

After making my purchase, I used Google to help me setup the VPS. I am rather new to running a VPS, so some of it might seem obvious to web admins, but setting up everything as I wanted it, was not as easy as expected (is it ever?).

## Change all passwords

As advised by RamNode, change all passwords sent in the email to strong replacements. This is very important for security reasons, nobody want an illegal service to be running on his/hers VPS! For security reasons, a passphrase consisting of some random words is not a bad choice. Pick something with a lot of entropy that you can remember. `h@110-w31c0m3` (`hello-welcome` with a popular replacement scheme) is much less secure than `unicorn-seven-waterfall-leaf-plate`. Passwords are changed with the `passwd` command in Linux.

## Locale issues

http://askubuntu.com/questions/454260/how-to-solve-locale-problem

## nginx repo

https://www.jamescoyle.net/how-to/1678-install-nginx-on-debian-ubuntu

## Auto start nginx

https://www.nginx.com/resources/wiki/start/topics/examples/systemd/
http://www.techsupportpk.com/2015/05/linux-systemd-essentials-working-with-services-units-and-the-journal.html

## Exchanging SSH keys

Typing a long password every time you want to log into your machine is cumbersome, so it's worth taking the time to exchange SSH keys. These allow for login without typing the password.

Given a set of public/private keys on both machines, we can exchange public keys using:

{{< highlight xml >}}
cat ~/.ssh/id_rsa.pub | ssh -p <PORT NUMBER> <USERNAME>@<IP-ADDRESS> 'cat >> .ssh/authorized_keys'
{{< /highlight >}}

You should also disable SSH access from the root user, as is [suggested here][ssh root].

## General Setup

I followed {{< blank_url "this guide" "http://designertuts.com/vps-setup-guide-for-ramnode-lamp.php">}} for the general VPS setup. But changed Apache to Nginx (pronounced _engine-x_), because Nginx is more resource efficient and uses less system resources.

## Self Hosted GitHub clone

{{< blank_url "Gogs" "https://github.com/gogits/gogs">}} is a self-hosted GitHub clone. I can have both public and private repo's, but my main goal is hosting private repos. The public ones can also be hosted on GitHub. This is more convenient since most people are used to that interface (though the Gogs interface is very similar by design). One could of course argue that private repos are possible on BitBucket, but I wanted to have more control over my data. The Gogs solution seems the best option to me for private repos.

I started by reading the official Gogs README, which listed {{< blank_url "this tutorial" "https://www.digitalocean.com/community/tutorials/how-to-set-up-gogs-on-ubuntu-14-04">}}. Very straight forward, but I found the steps on the native compilation a bit redundant, and downloaded the precompiled binaries from {{< blank_url "the official website" "https://gogs.io/docs/installation/install_from_binary">}}:

{{< highlight xml >}}
# be sure to check if not a more recent version has been published!
wget https://dl.gogs.io/gogs_v0.9.13_linux_amd64.zip
unzip gogs_v0.9.13_linux_amd64.zip
{{< /highlight >}}

That means I skipped step 2 and everything before the installation of `supervisor`.  The changes in the remainder are minor.

However, I wanted the Gogs service to run on a different port that port 80 (default HTTP port), so I changed the Nginx configuration to listen on port 30080.

In the future I want to configure the service to a subdomain. This is much cleaner and more user friendly than specifying a specific port number. This is on the TODO list.

## Piwik

If you want to have analytics based on user visits, you can do that using Google Analytics, but than you also pass all of your data to Google. A better way to do analytics is with Piwik. Piwik is an open-source analytics tool that you host yourself. You can control all of the data and adopt the configuration to your needs. It is less polished than Google Analytics, but I really want to host the analytics myself and Piwik is the go-to application for this. Read all about setting up Piwik in my [Open Source Analytics With Piwik blog post][piwik post].

## ownCloud

## OpenVPN

https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-debian-8
https://help.ubuntu.com/stable/serverguide/openvpn.html

## PHP

http://linuxbsdos.com/2015/02/17/how-to-reduce-php-fpm-php5-fpm-ram-usage-by-about-50/

# Mail

https://workaround.org/ispmail/jessie
http://serverfault.com/questions/713426/reverse-dns-is-not-a-valid-hostname
https://blog.stickleback.dk/getting-off-hotmails-blocklist/
https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-dkim-with-postfix-on-debian-wheezy
http://serverfault.com/questions/699908/how-to-verify-if-my-postfix-uses-really-tls-to-send-outgoing-mails
http://security.stackexchange.com/questions/81944/perfectly-secure-postfix-mta-smtp-configuration
http://serverfault.com/questions/120123/forcing-smtp-outgoing-mail-encryption-on-postfix

[ssh root]: {% post_url 2016-07-08-debian-lemp-stack-lets-encrypt-setup %}#restrict-ssh-access
[piwik post]: {% post_url 2016-07-14-open-source-analytics-with-piwik %}
