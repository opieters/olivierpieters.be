---
layout:   post
title:    Open Source Analytics with Piwik
draft:    false
tags:     [Piwik, nginx, Debian, VPS, PHP]
date:     "2016-07-14T10:35:00+02:00"
update:   "2016-08-16T11:01:00+02:00"
category: VPS
---

{{< blank_url "Google Analytics" "https://www.google.com/analytics/" >}} is a great tool to get more insight into user behaviour on a website. Despite being such a great tool, it requires the usage of the Google platform which results in handing over all this data to Google too. Furthermore, you are required to use cookies with Google Analytics. The usage of cookies is not necessarily a bad thing, but if the first thing people see is a cookie banner, they might quit the page immediately. So getting rid of cookies while still getting some more insight into user behaviour than what is typically available with a log analyser would be nice.
<!--more-->

{{< blank_url "Piwik" "https://piwik.org" >}} is a self-hosted open source solution that is perfect for these needs! Not only are we hosting everything ourselves, but we can also deactivate cookies and tracking in its entirety if the user's browser requests this. For me, this is the perfect compromise between user privacy while still being able to monitor popular pages and tailer content to more popular subjects.

Everything discussed here was tested on a Debian 8.5 (jessie) VPS setup. We are going to identify the Piwik installation using a subdomain: stats (e.g. stats.domain.com), so be sure to configure your DNS accordingly (if needed). We are going to use nginx as our web server and PHP5 as backend for Piwik. This is based on the {{< blank_url "piwik-nginx README" "https://github.com/perusio/piwik-nginx/blob/master/README.md" >}} and a {{< blank_url "this tutorial by Muhammad Arul" "https://www.howtoforge.com/tutorial/how-to-install-piwik-with-nginx-on-ubuntu-15-10/" >}}.

## Prerequisites

### Install and Configure PHP5

The first thing we are going to do, is install PHP-FPM:

{{< highlight shell >}}
sudo apt-get install php5-fpm php5-mysql php5-curl php5-gd php5-cli php5-geoip
{{< /highlight >}}

Open the standard PHP configuration file:

{{< highlight shell >}}
sudo nano /etc/php5/fpm/php.ini
{{< /highlight >}}

And set the `cgi.fix_pathinfo` to `0` and the `always_populate_raw_post_data` to `-1`. Normally these are commented, so first uncomment them by removing the `;`. If you are using the nano editor you can quickly search for these with CTRL-W (`^W`) and then type the variable name.

`cgi.fix_pathinfo` fixes an important security concern {{< blank_url "explained here" "http://serverfault.com/questions/627903/is-the-php-option-cgi-fix-pathinfo-really-dangerous-with-nginx-php-fpm" >}}. Te other parameter (`always_populate_raw_post_data`) force PHP not to define `$HTTP_RAW_POST_DATA`. Since PHP 5.6 it's deprecated, and even unavailable in PHP 7. The preferred way to input data is through `php://input`. Deactivating the olde method makes your system more secure. See also the {{< blank_url "official PHP documentation" "http://php.net/manual/en/ini.core.php#ini.always-populate-raw-post-data" >}}.

Start PHP with this command:

{{< highlight shell >}}
sudo service php5-fpm start
{{< /highlight >}}

### Backing up Nginx

We will be using a preconfigured nginx setup, so backup the current one in case you want to revert or something goes wrong. Just move all files to a new directory:

{{< highlight shell >}}
sudo mv /etc/nginx/ /etc/nginx-old/
{{< /highlight >}}

## New Nginx Configuration

### Serving Files over a Secure Connection

Now install the preconfigured nginx files from {{< blank_url "this git repo" "https://github.com/perusio/piwik-nginx/" >}}:

{{< highlight shell >}}
sudo git clone https://github.com/perusio/piwik-nginx.git /etc/nginx
{{< /highlight >}}

Change the default configuring file's name to something more appropriate and open it to add our domain:

{{< highlight shell >}}
cd /etc/nginx/sites-available/        # move to nginx conf directory
sudo mv stats.example.com.conf stats  # change filename to `stats`
sudo nano stats                       # open Piwik configuration file for nginx
{{< /highlight >}}

Update the configuration to something similar to the file below. We are not going to use IPv6 (because there is limited value in it) and removing it simplifies the setup. You can always add IPv6 later on, but for now we'll continue with an IPv4-only configuration.

{{< highlight text >}}
# -*- mode: nginx; mode: flyspell-prog; mode: autopair; ispell-local-dictionary: "american" -*-
### Nginx configuration for Piwik.

# HTTP traffic
server {
    listen 80;

    ## Uncomment to activate IPv6 and update the address below
    ## (stolen from wikipedia).
    #listen [fe80::202:b3ff:fe1e:8329]:80 ipv6only=on;

    limit_conn arbeit 64;
    server_name stats.domain.com;

    ## Access and error log files.
    access_log /var/log/nginx/stats.domain.com_access.log;
    error_log /var/log/nginx/stats.domain.com.log;

    ## See the blacklist.conf file at the parent dir: /etc/nginx.
    ## Deny access based on the User-Agent header.

    ## -> Uncomment the lines below to enable bad bot blocking based
    ## on UA string.
    # if ($bad_bot) {
    #     return 444;
    # }
    ## -> Uncomment the lines below to enable bad bot blocking based
    ## on referer header.
    ## Deny access based on the Referer header.
    # if ($bad_referer) {
    #     return 444;
    # }

    # redirect all traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }

    # Let's Encrypt challenges can go over HTTP
    location /.well-known/acme-challenge/ {
        alias /home/acme/challenges/;
        try_files $uri =404;
    }

}

# HTTPS traffic
server {
    listen 443 ssl;
    server_name stats.domain.com;

    # limit number of connections to arbeit zone
    limit_conn arbeit 64;

    # SSL/TLS configuration
    ssl on;
    ssl_certificate /etc/letsencrypt/live/chained.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    ssl_prefer_server_ciphers on;
    ssl_stapling on;
    ssl_stapling_verify on;

    access_log /var/log/nginx/stats.domain.com_access.log;
    error_log /var/log/nginx/stats.domain.com.log;

    ## See the blacklist.conf file at the parent dir: /etc/nginx.
    ## Deny access based on the User-Agent header.

    root /var/www/piwik;            # Piwik root directory
    index index.php piwik.php;

    ## Include the piwik configuration.
    include apps/piwik/piwik.conf;
}
{{< /highlight >}}

The comments should provide sufficient documentation. Be sure to have a valid certificate before continuing. Update the locations to reflect your setup. You can read [my Let's Encrypt post]({{< ref "/blog/debian-lemp-stack-lets-encrypt-setup.md" >}}) on how to set up HTTPS certificates with {{< blank_url "Let's Encrypt" "https://letsencrypt.org" >}}.

Go to one of the many intermediate nginx configuration files for Piwik:

{{< highlight shell >}}
sudo nano /etc/nginx/apps/piwik/piwik.conf
{{< /highlight >}}

Change the `valid_referers` variable to include your domain: `valid_referers = none blocked *.domain.com domain.com;`. For my configuration, that results in: `none blocked *.olivierpieters.be olivierpieters.be;` This sets all the “Referer” (yes, that typo was intentional) request header field values that will cause the embedded `$invalid_referer` variable to be set to an empty string. Basically, it redefines which referer values are allowed. `none` means that requests that are not referred are passed, while `blocked` means that the referer field that is present, but its value has beed deleted (e.g. by a proxy or firewall) is also allowed. Finally, we also allow referring on our own website (final two).  More information in the {{< blank_url "official nginx docs" "http://nginx.org/en/docs/http/ngx_http_referer_module.html#valid_referers" >}}.

Also disable proxy caching by commenting `include apps/piwik/proxy_piwik_cache.conf;` since we are not using Apache. After applying these final changes, check the nginx configuration with `sudo nginx -t`.

### Enabling PHP

Time to modify the PHP setup. Go to the php-fpm upstream configuration and change the server to a php5 socket. These should be faster than regular network connections:

{{< highlight shell >}}
sudo nano /etc/nginx/upstream_phpcgi.conf
{{< /highlight >}}

Update the `server` as follows:

{{< highlight text >}}
server unix:/var/run/php5-fpm.sock;
{{< /highlight >}}

If you suspect your socket to be set up on a different location, you can check the location by listing all sockets present: `netstat --unix -l`.

FastCGI will need a cache directory for Piwik, so let's create it:

{{< highlight shell >}}
sudo mkdir -p /var/cache/nginx/fcgicache
sudo chown -R www-data:www-data /var/cache/nginx/
sudo chown -R www-data:www-data /var/cache/nginx/fcgicache
{{< /highlight >}}

We changed ownership to the `www-data` user and group. This is the user on which nginx is run by default.

Create a symbolic link that will tell nginx you want to activate the Piwik configuration:

{{< highlight shell >}}
sudo mkdir /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/stats /etc/nginx/sites-enabled/stats
{{< /highlight >}}

Finally, we need to test and activate this configuration. Test the configuration for possible errors with `sudo nginx -t`. If error are present in the configuration, this will tell you where the first error occurred. These need to be fixed before we can continue. Finally enable the configuration:

{{< highlight shell >}}
sudo service php5-fpm restart # restart PHP
sudo service nginx restart    # or start if nginx is not running
{{< /highlight >}}

## Creating a Database for Piwik

As database backend, we are going to use the MySQL compatible MariaDB. Install the server and the client, then set up a root user (similar to a Linux root user):

{{< highlight shell >}}
sudo apt-get install mariadb-server mariadb-client
mysql_secure_installation
{{< /highlight >}}

You should remove the test and anonymous users for security reasons. Now login into the database and create the Piwik database:

{{< highlight shell >}}
mysql -u root -p
Enter password:
MariaDB [(none)]> CREATE DATABASE piwikdb;
MariaDB [(none)]> CREATE USER piwikuser@localhost IDENTIFIED BY 'PASSWORD';
MariaDB [(none)]> GRANT ALL PRIVILEGES ON piwikdb.* TO piwikuser@localhost IDENTIFIED BY 'PASSWORD';
MariaDB [(none)]> FLUSH PRIVILEGES;
MariaDB [(none)]> \q
{{< /highlight >}}

Now we have created a database (`piwikdb`) and user `piwikuser` with password `PASSWORD` (change this to a strong password!) for Piwik. This wraps up all the work we had to do prior to installing Piwik. We will now install Piwik (finally!).

## Installing Piwik

We already set the install location for Piwik to the `/var/www/piwik` folder (this must match the `root` variable in your nginx configuration for Piwik). So let's move to that folder and download Piwik:

{{< highlight shell >}}
cd /var/www
# download Piwik installation
sudo wget https://github.com/piwik/piwik/archive/master.zip
# extract Piwik installation
sudo unzip master.zip
# move to desired directory
sudo mv piwik-master/ piwik/
# remove zipped Piwik installation
sudo rm master.zip
{{< /highlight >}}

Now move into the Piwik installation and install PHP-composer and the Piwik PHP dependencies:

{{< highlight shell >}}
cd piwik/
sudo curl -sS https://getcomposer.org/installer | sudo php
sudo php composer.phar install --no-dev
cd ..
# change ownership to www-data user:group
sudo chown -R www-data:www-data piwik/
{{< /highlight >}}

Apply all changes to PHP-FPM and nginx by restarting both:

{{< highlight shell >}}
sudo service nginx restart
sudo service php5-fpm restart
{{< /highlight >}}

Now you should be able to use the Piwik browser setup to finish the installation.

## Browser Based Piwik Configuring

Go to stats.domain.com and you should now see the Piwik Welcome screen. Follow the setup (it's very straightforward) and you should end up with a working Piwik configuration. Some notes about the setup: See to it that everything works during the system check (I got a HTTPS 500 warning on the piwik.php page, but this is not a real issue since the index.php page is still accessible). During database configuration, enter the details of the MariaDB we created earlier and set the table prefix to `stats_` and select the `MYSQLI` adapter. Piwik now uses this to create its tables and you can continue to the Super user login. Pick a nice login name and strong password to protect your data. Finally enter some details about your website and copy the snippet for usage on your websites.

As discussed in the introduction privacy is important. Thus, it's good practice to enable IP anonymisation and "Do Not Track" support. By default, cookies will be used to get more user information, but we are going to deactivate this. To this end, add `_paq.push(['disableCookies']);` before `_paq.push(['trackPageView']);` in the snippet Piwik produced.

## Conclusion

Now you have a working Piwik configuration running and you can start observing which pages of your website get the most attention without requiring a nasty cookie popup or neglecting your visitor's privacy.

## Some Additional Notes

Piwik might display {{< blank_url "an 'Oeps...' error" "https://piwik.org/faq/troubleshooting/faq_19489/" >}}. It can easily be fixed by changing the PHP configuration as suggested {{< blank_url "here" "http://stackoverflow.com/questions/4575341/php-with-apc-fatal-errors-cannot-redeclare-class" >}}.

Open the configuration file from before (`/etc/php5/fpm/php.ini`). Then append the following at the end:

{{< highlight text >}}
apc.include_once_override = 0
apc.canonicalize = 0
apc.stat = 0
{{< /highlight >}}

Finally, restart the PHP service for the changes to take effect: `sudo service php5-fpm restart`. This should fix this specific issue.
