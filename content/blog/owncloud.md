---
layout:   post
title:    Adding ownCloud to a LEMP Stack
draft:    false
tags:     [ownCloud, cloud, nginx, Debian, VPS]
category: VPS
date:     "2016-07-29T10:35:00+02:00"
slug: owncloud
---

Services like Dropbox, Google Apps (Drive, Calendar, Contacts...) and iCloud are really great options to store and share files, for email and to have your information synced between devices. However, you must trust these third parties with your data. And -- at large companies --  have it used to serve tailored advertisements and to learn more about you. Since I am running a VPS, most of these services (notably absent is email) can be replaced by a self-hosted one: ownCloud.
<!--more-->

The set-up of ownCloud is similar to that of Piwik: add a database, install dependencies and hope everything works well. So let's try to set it all up. This blogpost is based on previous work by {{< blank_url "Xiao Guoan" "https://www.linuxbabe.com/linux-server/setup-owncloud-9-server-nginx-mariadb-php7-debian" >}}, the {{< blank_url "ownCloud official docs" "https://doc.owncloud.org/server/9.0/admin_manual/installation/source_installation.html#php-fpm-tips-label" >}} and {{< blank_url "rosehosting.com" "https://www.rosehosting.com/blog/install-owncloud-7-with-nginx-and-php-fpm-on-an-ubuntu-vps/" >}}.

## Prerequisites

I am (again) assuming you are using a Debian 8.5 (jessie) setup. I have not tested how the setup translates to Ubuntu (or other) systems, but expect everything to be very similar.

### Install Database: MariaDB

The very first thing we are going to do, is add a database for ownCloud. As in the Piwik post, we are going to use MariaDB. Update apt-get and install `mariadb-server`:

{{< highlight shell >}}
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install mariadb-server
{{< /highlight >}}

Then configure a root user for the database (if not done already):

{{< highlight shell >}}
mysql_secure_installation
{{< /highlight >}}

After following the setup instructions you will have one database user (`root`) that has root privileges, similar to the Linux root user.

Now, create the database with:

{{< highlight shell >}}
mysql -u root -p
Enter password:
MariaDB [(none)]> CREATE DATABASE owncloud;
MariaDB [(none)]> GRANT ALL ON owncloud.* TO ownclouduser@localhost IDENTIFIED BY 'YOURPASSWORD';
MariaDB [(none)]> FLUSH PRIVILEGES;
MariaDB [(none)]> \q
{{< /highlight >}}

I opted to name everything conveniently (and analogous to the Piwik naming convention). If you want to use a different database name, do not change the `owncloud.*` part! This part is fixed and will be used by ownCloud to find the database. You should preferably choose a strong password.

We also need to make some changes to the MariaDB configuration. Open the configuration file:

{{< highlight shell >}}
sudo nano /etc/mysql/my.cnf # can also be `sudo nano /etc/my.cnf`
{{< /highlight >}}

And add the following to the `[mysqld]` section:

{{< highlight text >}}
log-bin        = /var/log/mysql/mariadb-bin
log-bin-index  = /var/log/mysql/mariadb-bin.index
binlog_format  = mixed
{{< /highlight >}}

Restart the service afterwards:

{{< highlight shell >}}
sudo service mysql restart
{{< /highlight >}}

### Install and Configure PHP

Since I already set-up Piwik, I did not need to install any PHP5 dependencies, but this list should be complete:

{{< highlight shell >}}
sudo apt-get install nginx php5-fpm php5-common php5-cli php5-json php5-mysql php5-curl php5-intl php5-mcrypt php5-memcache php5-gd
{{< /highlight >}}

The default php-fpm configuration is almost OK, we need to change the configuration slightly to make everything work as intended. First, search for the file that sets all environment variables. The contents should be similar to this:

{{< highlight text >}}
;env[HOSTNAME] = $HOSTNAME
;env[PATH] = /usr/local/bin:/usr/bin:/bin
;env[TMP] = /tmp
;env[TMPDIR] = /tmp
;env[TEMP] = /tmp
{{< /highlight >}}

I ended up doing a simple recursive egrep search:

{{< highlight shell >}}
egrep -R 'env'
{{< /highlight >}}

For me, this file was located here: `/etc/php5/fpm/pool.d/www.conf`. Uncomment (or add) the above lines if commented (remove the `;`). This is needed because ownCloud expects the environment variables to be set up correctly and will issue warnings if not. In case you cannot find the file, search for a file named `www.conf` in the `/etc/php5/fpm/` directory. Then add all the above lines without the `;`.

Change the listen mode also to:

{{< highlight text >}}
listen.mode = 0660
{{< /highlight >}}

Finally apply these changes:

{{< highlight shell >}}
sudo service php5-fpm restart
{{< /highlight >}}

Now reopen the file and search for the `listen` variable. Remember its value, it will be important later on. My value is: `listen = /var/run/php5-fpm.sock`.

## Install the ownCloud Repository

After setting up the necessary dependencies, we need to install ownCloud itself. ownCloud is usually not included in the default apt-get repositories, so we need to add it first:

{{< highlight shell >}}
# move to current directory
cd ~
# Download ownCloud signing key
wget -nv https://download.owncloud.org/download/repositories/stable/Debian_8.0/Release.key -O Release.key
# add key to apt-get
sudo apt-key add - < Release.key
# add official ownCloud repo
sudo sh -c "echo 'deb http://download.owncloud.org/download/repositories/stable/Debian_8.0/ /' >> /etc/apt/sources.list.d/owncloud.list"
# remove key from home directory
rm Release.key
{{< /highlight >}}

Now, we can install the ownCloud core with:

{{< highlight shell >}}
sudo apt-get update
sudo apt-get install owncloud-files
{{< /highlight >}}

We do not install the entire ownCloud stack, since we are going to use nginx and ownCloud uses Apache by default. ownCloud will be installed in the `/var/www/owncloud` repository. The permissions should be set correctly by apt-get, so we don't need to worry about that. Additionally, updating the ownCloud setup will be very easy through apt-get.

## Configuring Nginx

We need to create a configuration file for nginx, similar to the personal website and Piwik configuration files. We'll name it `cloud`, because its most logical hosting location is `cloud.domain.com`.

Create the configuration file:

{{< highlight shell >}}
sudo nano /etc/nginx/sites-available/cloud
{{< /highlight >}}

And enter the following to set up an SSL connection:

{{< highlight text >}}
# locate PHP on server
upstream php-handler {
    server unix:/var/run/php5-fpm.sock;
}

# Rout all HTTP traffic over HTTPS except for Let's Encrypt challenges
server {
    listen 80;

    server_name cloud.domain.com;

    location / {
        return 301 https://$host$request_uri;
    }

    location /.well-known/acme-challenge/ {
        alias /home/acme/challenges/;
        try_files $uri =404;
    }

}

# HTTPS configuration
server {
    listen 443;
    server_name cloud.domain.com;

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

    # Security related header modifications for ownCloud
    add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Robots-Tag none;
    add_header X-Download-Options "noopen";
    add_header X-Permitted-Cross-Domain-Policies "none";

    root /var/www/owncloud;       # locate ownCloud installation
    client_max_body_size 10G;     # max. upload file size
    fastcgi_buffers 64 4K;        # number and size of buffers for FastCGI (PHP)

    gzip off;                     # no compression

    index index.php;              # index page

    # error page locations
    error_page 403 /core/templates/403.php;
    error_page 404 /core/templates/404.php;

    # rewrite urls
    rewrite ^/.well-known/carddav /remote.php/carddav/ permanent;
    rewrite ^/.well-known/caldav /remote.php/caldav/ permanent;

    # The following 2 rules are only needed for the user_webfinger app.
    # Uncomment it if you're planning to use this app.
    #rewrite ^/.well-known/host-meta /public.php?service=host-meta last;
    #rewrite ^/.well-known/host-meta.json /public.php?service=host-meta-json last;

    # Search crawler configuration (Google, DuckDuckGo)
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    # deny access to these locations (inner workings of ownCloud)
    location ~ ^/(build|tests|config|lib|3rdparty|templates|data)/ {
        deny all;
    }
    location ~ ^/(?:\.|autotest|occ|issue|indie|db_|console) {
        deny all;
    }

    # more rewriting
    location / {
        rewrite ^/remote/(.*) /remote.php last;
        rewrite ^(/core/doc/[^\/]+/)$ $1/index.html;
        try_files $uri $uri/ =404;
    }

    # PHP configuration
    location ~ \.php(?:$|/) {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_param HTTPS on;
        fastcgi_param modHeadersAvailable true; #Avoid sending the security headers twice
        fastcgi_pass php-handler;
        fastcgi_intercept_errors on;
    }

    # Adding the cache control header for js and css files
    # Make sure it is BELOW the location ~ \.php(?:$|/) { block
    location ~* \.(?:css|js)$ {
        add_header Cache-Control "public, max-age=7200";
        # Add headers to serve security related headers
        add_header Strict-Transport-Security "max-age=15768000; includeSubDomains; preload;";
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Robots-Tag none;
        # Optional: Don't log access to assets
        access_log off;
    }

    # Optional: Don't log access to other assets
    location ~* \.(?:jpg|jpeg|gif|bmp|ico|png|swf)$ {
        access_log off;
    }
}
{{< /highlight >}}

This is quite a lengthy file, so be sure to make appropriate changes for your configuration. Change the `server unix:/var/run/php5-fpm.sock;` at the beginning to the PHP `listen` variable we talked about before. You might need to change `ssl_certificate`, `ssl_certificate_key` and `ssl_dhparam` to reflect your certificate and key location. If ownCloud was installed to a different location, change the `root` variable.

To actviate the configuration, symlink it to the `sites-enabled` directory:

{{< highlight shell >}}
sudo ln -s /etc/nginx/sites-available/cloud /etc/nginx/sites-enabled/cloud
{{< /highlight >}}

And finally restart nginx:

{{< highlight shell >}}
sudo service nginx restart
{{< /highlight >}}

## Final Steps

Now, go to your cloud domain location with a web browser, create an admin user and set up the database to the MariaDB we created earlier. After this is done, check for errors in the admin panel (located under your username). If everything went as planned, you should now have a full functional cloud with ownCloud!

## Troubleshooting

The default nginx configuration might run nginx in the `nginx` user. Change the `user` parameters in `/etc/nginx/nginx.conf` to the following:

{{< highlight text >}}
user = www-data www-data;
{{< /highlight >}}

