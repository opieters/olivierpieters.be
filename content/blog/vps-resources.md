---
title:  VPS Resources
date:   "2016-10-07T17:00:00+02:00"
draft:  false
tags:   [VPS, email, Debian]
---

A few months ago, I decided to switch from shared hosting to a VPS based setup. This has much more flexibility, but requires a bit (read: a lot) more work to get things going. Three months later and I have deployed a number of services on it that were just not possible in a typical shared hosting environment (email, ownCloud and Gogs to name a few). Sometimes this was fairly straightforward to set-up, but other times it took more than a few hours. Below is a list of useful resources I used to get everything going.
<!--more-->

## Debian Specific

* {{< blank_url "How to solve LOCALE problem" "http://askubuntu.com/questions/454260/how-to-solve-locale-problem" >}}
* {{< blank_url "systemd" "http://www.techsupportpk.com/2015/05/linux-systemd-essentials-working-with-services-units-and-the-journal.html" >}}
* {{< blank_url "Ramnode" "http://designertuts.com/vps-setup-guide-for-ramnode-lamp.php" >}}

## HTTP server

* {{< blank_url "Install nginx" "https://www.jamescoyle.net/how-to/1678-install-nginx-on-debian-ubuntu" >}}
* {{< blank_url "Start nginx at system startup" "https://www.nginx.com/resources/wiki/start/topics/examples/systemd/" >}}

## PHP

* {{< blank_url "Reduce php-fpm RAM usage" "http://linuxbsdos.com/2015/02/17/how-to-reduce-php-fpm-php5-fpm-ram-usage-by-about-50/" >}}

# Mail

* ](){{< blank_url "[Running an email server" "https://workaround.org/ispmail/jessie" >}}
* {{< blank_url "Reverse DNS is not a valid hostname" "http://serverfault.com/questions/713426/reverse-dns-is-not-a-valid-hostname" >}}
* {{< blank_url "Getting off Hotmail's blocklist" "https://blog.stickleback.dk/getting-off-hotmails-blocklist/" >}}
* {{< blank_url "How To Install and Configure DKIM with Postfix on Debian Wheezy" "https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-dkim-with-postfix-on-debian-wheezy" >}}
* {{< blank_url "How to verify if my postfix uses really TLS to send outgoing mails?" "http://serverfault.com/questions/699908/how-to-verify-if-my-postfix-uses-really-tls-to-send-outgoing-mails" >}}
* {{< blank_url "More secure Postfix MTA configuration" "http://security.stackexchange.com/questions/81944/perfectly-secure-postfix-mta-smtp-configuration" >}}
* {{< blank_url "Forcing smtp outgoing mail encryption on postfix" "http://serverfault.com/questions/120123/forcing-smtp-outgoing-mail-encryption-on-postfix" >}}
* {{< blank_url "`check-auth@verifier.port25.com`" "https://www.port25.com/authentication-checker/" >}} useful mail address to check configuration


## Security

* {{< blank_url "Install Fail2ban" "https://www.linode.com/docs/security/using-fail2ban-for-security" >}}

## Bells and Whistles

* {{< blank_url "Gogs" "https://gogs.io/docs/installation/install_from_binary" >}}
* {{< blank_url "How To Set Up an OpenVPN Server on Debian 8" "https://www.digitalocean.com/community/tutorials/how-to-set-up-an-openvpn-server-on-debian-8" >}}
* {{< blank_url "Install OpenVPN" "https://help.ubuntu.com/stable/serverguide/openvpn.html" >}}
