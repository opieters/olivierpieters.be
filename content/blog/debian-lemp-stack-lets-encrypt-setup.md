---
title:    Debian LEMP Stack Let's Encrypt Setup
date:     "2016-07-08T08:34:41+02:00"
draft:   false
update:   "2016-08-07T22:44:00+02:00"
tags:     [Let's Encrypt, Debian, nginx, Security, VPS]
category: VPS
---

My website has been online for almost a year now, and used a standard HTTP Apache server since day one. Observant visitors will have noticed this changed on 6th July 2016. It has long since been on the to-do list, and it's finally working (after some errors, cursing and downtime of this website). The process of getting everything working well was not painless to say the least.
<!--more-->

{{< blank_url "Let's Encrypt" "https://letsencrypt.org" >}} is a free certification authority. It really can't become any cheaper, giving web admins no longer a good reason not to use HTTPS. Because there are a ton of choices for OS, web server... making it more difficult for the developers and contributors of Let's Encrypt to have support for everything. There is of course the `sudo` thing to keep in mind too. Fully automated scripts will require `sudo`, requiring you to trust the developer or do a manual setup. In addition, a full manual setup is not optimal either because Let's Encrypt certificates are only valid for 90 days.

In my quest for the perfect Let's Encrypt setup, I ended up using three sources: {{< blank_url "scotthelme.co.uk" "https://scotthelme.co.uk/setting-up-le/" >}}, {{< blank_url "acme-tiny readme" "https://github.com/diafygi/acme-tiny" >}} and {{< blank_url "digitalocean.com" "https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04" >}}. They all provided part of the puzzle, but the final solution is quite elegant, I think (though the amount of manual setup is still more than I'd like). A remark beforehand: I am a rather _average_ Linux user and definitely not an expert in terms of server (VPS) configuration or Linux privileges, so most of this will be based on material I read or tutorials I found online plus of course some of my own experience.

## Prerequisites

I am silently assuming you are using a Debian 8.5 (jessie) setup with a LEMP stack (nginx is the HTTP server, not Apache). I have not tested how the setup translates to Ubuntu (or other Unix-like) systems, but expect everything to be very similar.

### A New User for Security Reasons

To restrict access of the `acme_tiny` script to specific parts of the system, we will create a new Linux user, called `acme`:

{{< highlight shell >}}
sudo adduser acme
{{< /highlight >}}

Use a _strong password_ for security reasons. The rest can be chosen as desired.

Then switch from the current user to the `acme` user:

{{< highlight shell >}}
su acme
cd ~
{{< /highlight >}}

Now, clone the `acme_tiny` script:

{{< highlight shell >}}
git clone https://github.com/diafygi/acme-tiny.git
{{< /highlight >}}

We also need a directory for the Let's Encrypt challenges:

{{< highlight shell >}}
mkdir /home/acme/challenges/
{{< /highlight >}}

### Update Nginx Configuration

For each of your configurations in `/etc/nginx/sites-available/` we'll need to add a specific entry for the challenge verification. If Let's Encrypt is not able to access the challenges directory, it won't issue a certificate. Again, using the regular user, edit the configuration to include the following:

{{< highlight text >}}
server {
    listen 80;

    location /.well-known/acme-challenge/ {
        alias /home/acme/challenges/;
        try_files $uri =404;
    }

    # rest of the configuration
}
{{< /highlight >}}

### Setting Permissions

We also need to allow the `acme` user to reload the nginx configuration after the certificates have been updated. To this end, we will need to grant it very specific `sudo` rights. Open the `sudo` configuration (from the regular user, this is best done from a second terminal window):

{{< highlight shell >}}
sudo visudo
{{< /highlight >}}

Add the following to the bottom of the file:

{{< highlight shell >}}
acme    ALL=NOPASSWD: /usr/sbin/service nginx *
{{< /highlight >}}

This will grant `acme` the right to change the nginx service without prompting for a password. This is the only thing it can do that usually requires `sudo`.

## Generating a User and Domain Key

From now until the end of this how-to, we will use the newly created user `acme` unless otherwise specified. First, we are going to generate an RSA user public/private key pair. This will later be used to sign the certificates. To do this, run:

{{< highlight shell >}}
openssl genrsa 4096 > user.key
openssl rsa -in user.key -pubout > user.pub
{{< /highlight >}}

It's very important that you _understand_ that's happening when configuring a web server, especially concerning security aspects. The above code is no exception, so let's investigate: the first line generates a 4096-bit RSA key with {{< blank_url "OpenSSL" "https://www.openssl.org" >}} (a well known TLS/SSL toolkit). This key is then dumped into a file (with the redirection to file: `> user.key`). In the second command we use this file -- which contains the _private_ RSA key -- as input and generate the public key (option `-pubout`), which is also saved into a file.

For each set of domains (I only have one: {{< blank_url "olivierpieters.be" "https://olivierpieters.be" >}}, we are also going to create a private key. We can issue an analogous command:

{{< highlight shell >}}
openssl genrsa 4096 > domain.key
{{< /highlight >}}

## Generating a Strong Diffie-Hellman Group

People who want even stronger security, will want to create a custom Diffie-Hellman group (it might take a while for the command to finish, wait patiently):

{{< highlight shell >}}
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
{{< /highlight >}}

This file will later on be used in the nginx configuration. If you want even more security (e.g. 4096-bit primes), you can change the parameters, but be sure to scale the RSA key size accordingly! An RSA key is composed of _two_ primes and will thus have two times the size of the Diffie-Hellman primes. The overall security is determined by the weakest part.

## Generating and Signing the Certificate

By now, we have generated some keys and a new user to run the required scripts. With these, we can create a certificate request which will be signed by Let's Encrypt. The result is a certificate we can use to start a trusted TLS (HTTPS) connections.

### Generating a Certificate Signing Request

Next, we are going to copy the default OpenSSL configuration to the current directory. This is done with `cp`:

{{< highlight shell >}}
cp /etc/ssl/openssl.cnf openssl.cnf
{{< /highlight >}}

Now, edit this file and uncomment the following line in the `[ req ]` section:

{{< highlight shell >}}
req_extensions = v3_req
{{< /highlight >}}

This will activate the version 3 extensions in the {{< blank_url "X.509 certificates" "https://en.wikipedia.org/wiki/X.509" >}} that are used on the web. We are going to create one of these later on.

Next, go to the `[ v3_req ]` section and add the following line:

{{< highlight shell >}}
subjectAltName = @alt_names
{{< /highlight >}}

This sets the `subjectAltName` to the list of entries in the `alt_names` section, which will equal all DNS entries we want to authenticate.

The final thing to add is the `alt_names` section (at the bottom of the file). List all A-records (you can of course also include AAAA-records for IPv6) DNS entries you want to authenticate, but be sure to _only include_ A-record (or AAAA-record) DNS entries!

{{< highlight shell >}}
[ alt_names ]

DNS.1 = domain.be
DNS.2 = www.domain.be
DNS.3 = git.domain.be
DNS.4 = cloud.domain.be
DNS.5 = stats.domain.be
{{< /highlight >}}

Save the file and exit. Finally, the configuration is done and it's time to generate the certificate signing request file:

{{< highlight shell >}}
openssl req -new -sha256 -key domain.key -out domain.csr -config openssl.cnf
{{< /highlight >}}

Observe that we used the {{< blank_url "SHA2" "https://en.wikipedia.org/wiki/SHA-2" >}} hashing scheme which is sufficiently secure for modern day security applications and the private key for the _domain_ (`domain.key`). The rest is very straightforward. A menu will also open and some fields need to be filled in. You can leave them blank or fill in the appropriate fields (a default non-empty value is made empty by typing `.`). Do mind that you can _only_ use an empty value or a _valid_ A-record (AAAA-record) DNS entry for the `Common Name` part. Otherwise the `acme_tiny` script will crash! You don't need to add a passphrase. If you do add one however, you will be prompted to enter it every time you perform an operation with this certificate signing request file.

The interactive prompt part can also be skipped by adding `-sub '/'`:

{{< highlight shell >}}
openssl req -new -sha256 -subj '/' -key domain.key -out domain.csr -config openssl.cnf
{{< /highlight >}}

We can check the certificate by typing:

{{< highlight shell >}}
openssl req -in domain.csr -noout -text
{{< /highlight >}}

Then look for the `X509v3 Subject Alternative Name:` part and all the DNS entries you created in the `alt_names` section should be listed here.

### Updating Permissions

We have created all necessary files to run the `acme_tiny` script. However, not all permissions have not yet been set up correctly. _All_ private keys are still visible for _all_ users. This is not desirable! We will see in the subsequent that `acme_tiny` requires access to `user.key`. In consequence, we can only restrict access to `domain.key`. Execute the following commands from a user with root privileges:

{{< highlight shell >}}
chown root:root /home/acme/domain.key
chmod 700 /home/acme/domain.key
{{< /highlight >}}

This will change ownership from `acme` to `root` and set the flags correctly. Only the root user is able to able to read the file. I opted to leave the file in `/home/acme` because all certificates live in the same folder this way. Moving the `domain.key` file to `/root` for example would only complicate the setup and won't add any security benefit.

### Obtaining a Signed Certificate

Now, it's time to let `acme_tiny` do the work:

{{< highlight shell >}}
python /home/acme/acme-tiny/acme_tiny.py --account-key /home/acme/user.key --csr /home/acme/domain.csr --acme-dir /home/acme/challenges > /home/acme/domain.crt
{{< /highlight >}}

I used absolute paths just to be sure the correct files were used in their appropriate directories. The command itself is self explanatory. If everything is in order, you will have obtained a certificate: `domain.crt` in the home directory of the `acme` user.

For nginx, we also need to include the intermediate certificate to make everything run smoothly:

{{< highlight shell >}}
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
cat domain.crt intermediate.pem > chained.pem
{{< /highlight >}}

The first command fetches the intermediate certificate in `intermediate.pem`. The second command merges the two files in the `chained.pem` file. This is the file we'll use in the nginx configuration.

## Configuring Nginx for TLS Connections

Switch to a regular user with `sudo` privileges and update your nginx configuration. Create the following directory (the `-p` flag makes sure intermediate directories are created too):

{{< highlight shell >}}
sudo mkdir -p /etc/letsencrypt/live/
{{< /highlight >}}

Then create symbolic links from the certificates and keys in `/home/acme/` to `/etc/letsencrypt/live/`:

{{< highlight shell >}}
sudo ln -s /home/acme/chained.pem /etc/letsencrypt/live/chained.pem
sudo ln -s /home/acme/domain.key /etc/letsencrypt/live/domain.key
{{< /highlight >}}

This way, we don't have to mess with the privileges in the `/etc/` directory to make them writable for `acme` without `sudo`.

The keys and certificates are in place, time to update the nginx configuration again. We will forward all HTTP traffic to HTTPS traffic and set some common TLS/SSL parameters. The full configuration I use for my personal website is included below.

{{< highlight text >}}
server {
    listen 443 ssl;
    server_name domain.be www.domain.be;

    # TLS/SSL configuration
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

    location / {
        root /var/www/domain.be/public_html;
    }
}

server {
    listen 80;

    server_name domain.be www.domain.be;

    # Forward everything to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }

    # Let's Encrypt challenges, regular HTTP is OK
    location /.well-known/acme-challenge/ {
        alias /home/acme/challenges/;
        try_files $uri =404;
    }

}
{{< /highlight >}}

You can read more on nginx and HTTPS certificates in {{< blank_url "the official documentation" "http://nginx.org/en/docs/http/configuring_https_servers.html" >}}. To activate this configuration, restart nginx:

{{< highlight shell >}}
sudo service nginx restart
{{< /highlight >}}

## Restrict SSH Access

To improve security, we are going to remove SSH access to the `acme` user (and group). From a regular user, open the SSH configuration file:

{{< highlight shell >}}
sudo nano /etc/ssh/sshd_config
{{< /highlight >}}

Add the following lines to deny access to `acme`:

{{< highlight shell >}}
DenyUsers acme
DenyGroups acme
{{< /highlight >}}

It's also considered good practice if the root user is not accessible over SSH, just add it after `acme`:

{{< highlight shell >}}
DenyUsers acme root
DenyGroups acme root
{{< /highlight >}}

Additionally, ensure `PermitRootLogin` is set to `no`. Restart the SSH daemon to apply the new configuration:

{{< highlight shell >}}
sudo service ssh restart
{{< /highlight >}}

## Automatic Certificate Renewal

We are switching to the `acme` user again. First we are going to create a renewal script (`nano renew.sh`) which contains:

{{< highlight shell >}}
#!/bin/bash

python /home/acme/acme-tiny/acme_tiny.py --account-key /home/acme/user.key --csr /home/acme/domain.csr --acme-dir /home/acme/challenges > /home/acme/domain.crt || exit
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
cat /home/acme/domain.crt /home/acme/intermediate.pem > /home/acme/chained.pem
sudo service nginx restart
{{< /highlight >}}

This will issue a new certificate, append the intermediate one and restart the nginx service. I opted to redownload the intermediate certificate every time, since it needs renewal and creates negligible overhead because we're only running the script once a day.

Make this script executable:

{{< highlight shell >}}
chmod +x renew.sh
{{< /highlight >}}

This will exit correctly if the `acme_tiny` script fails, but we won't get a notification of this failure. If the Let's Encrypt API changes and we forget to update the script, we will end up with an invalid certificate after 90 days. This is suboptimal, so let's add an additional script that sends an email if it failed to update the certificates.

Open `renew.py` and add the following code to it:

{{< highlight python >}}
#!/usr/bin/env python3

from smtplib import SMTP
from subprocess import check_output, STDOUT, CalledProcessError
from datetime import datetime, timedelta

# source: http://stackoverflow.com/questions/10147455
def send_email(user, pwd, recipient, subject, body):
    mail_user = user
    mail_pwd = pwd
    from_mail = user
    to_mail = recipient if type(recipient) is list else [recipient]

    # Prepare actual message
    message = """From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (from_mail, ", ".join(to_mail), subject, body)
    try:
        server = SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(mail_user, mail_pwd)
        server.sendmail(from_mail, to_mail, message)
        server.close()
        print("Successfully sent the mail.")
    except:
        print("Failed to_mail send mail.")


if __name__ == "__main__":
    try:
        check_output("/home/acme/renew.sh", timeout=600, stderr=STDOUT)

        # certificate renewed, save date
        with open("/home/acme/days_left.txt","w") as f:
            now = datetime.now() + timedelta(days=90)
            f.write(now.strftime("%Y-%m-%d %H:%M:%S"))

        print("Updated certificate.")
    except CalledProcessError as error:
        now = datetime.now()

        # get days remaining
        remaining = 0
        with open("/home/acme/days_left.txt") as f:
            cert_issue_time = datetime.strptime(f.readline(), "%Y-%m-%d %H:%M:%S")
            cert_expire_time = cert_issue_time + timedelta(days=90)
            remaining = cert_expire_time - datetime.now()
            remaining = datetime(1,1,1) + remaining # convert to datetime object, http://stackoverflow.com/questions/4048651/

        # construct message
        subject = "%s example.com: LE certificate renewal failed. %d days remaining!" % (now.strftime("%Y-%m-%d %H:%M:%S"), remaining.day)
        body =  "On %s, the Let's Encrypt certificate renewal failed.\n" % now.strftime("%Y-%m-%d %H:%M:%S")
        body += "%d days remaining until certificate expires.\n" % (remaining.day-1)
        body += "Below is the output of the script for debugging.\n\n"
        body += "Return code: %d\n" % error.returncode
        body += "Output:\n"
        body += error.output.decode('utf-8')

        # send message
        send_email("example@gmail.comm", "password", "recipient@domain.com", subject, body)

        print("Failed to update certificate.")
{{< /highlight >}}

The code is fairly easy: first, we execute out shell script, as explained above. If the exit code is different from 0, the `CalledProcessError` will be thrown. This will cause the script to send an email from example@gmail.com to recipient@domain.com (you can use a different provider, but be sure to update the SMTP server) explaining when the error occurred and what went wrong. Be sure to check that two factor verification is turned off (and for Gmail, you should also allow less secure access). The mail also includes how long the current certificate will still be valid. Its expiration date is saved in the `days_left.txt` file for convenience (and not extracted from the certificate).

We also need to make this script executable:

{{< highlight shell >}}
chmod +x renew.py
{{< /highlight >}}

To automatically renew the certificate, we are going to use crontab. First we are going to create the log files using a regular user:

{{< highlight shell >}}
sudo touch /var/log/acme_tiny.log           # create log file
sudo chown acme:acme /var/log/acme_tiny.log # allow acme to write to file
{{< /highlight >}}

Next, open the configuration in `nano` (not the default `vim` editor):

{{< highlight shell >}}
export VISUAL=nano; crontab -e
{{< /highlight >}}

This is the line I used to automate the renewal process:

{{< highlight text >}}
0 7  *   *   3     /home/acme/renew.py >> /var/log/acme_tiny.log 2>&1
{{< /highlight >}}

Every Wednesday at 7AM the script is issued. This way, chances are very low I will have an expired certificate since Let's Encrypt certificates are valid for 90 days. Both `stdout` and `stderr` output are appended to the log file (`2>&1` redirects `stderr` to `stdout` and `>>` appends it all to the file)

## Conclusion

So, that wraps up this quite lengthy blog post. The process to set everything up correctly requires some effort, but once it's all working well, the additional effort is minimal. You can test the strength of your configuration online at {{< blank_url "SSL Labs" "https://www.ssllabs.com/ssltest/">}} (you should obtain an A score). One remark I might add: the key pairs used by the scripts are fixed in this setup. It is good practice to renew them once a year, just in case ;-).

## Update: Automatic Key Renewal

As noted in the conclusion, we should also update the keys after some time. We can do this manually, but scripted is even better! We are going to run a modified version of `renew.py` the root users crontab. We are using the root user since he is the only one who has access to all keys.

We will need a new shell script that executes the following commands (I used `/root/newkeys.sh` as filename):

{{< highlight shell >}}
#!/bin/bash

openssl genrsa 4096 > /home/acme/user.key
openssl rsa -in /home/acme/user.key -pubout > /home/acme/user.pub
openssl genrsa 4096 > /home/acme/domain.key
openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
openssl req -new -sha256 -subj '/' -key /home/acme/domain.key -out /home/acme/domain.csr -config /home/acme/openssl.cnf
service nginx restart
{{< /highlight >}}

This will create the new keys, certificate signing request and Diffie-Hellman group. Again, we want to have a notification if the script fails, so we're going to use a variant of the `renew.py` script. Open `/root/newkeys.py` and add the following:

{{< highlight python >}}
#!/usr/bin/env python3

from smtplib import SMTP
from subprocess import check_output, STDOUT, CalledProcessError
from datetime import datetime, timedelta
import shutil, os

files = ["user.pub", "user.key", "domain.key", "domain.crt", "chained.pem"]

# source: http://stackoverflow.com/questions/10147455
def send_email(user, pwd, recipient, subject, body):
    mail_user = user
    mail_pwd = pwd
    from_mail = user
    to_mail = recipient if type(recipient) is list else [recipient]

    # Prepare actual message
    message = """From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (from_mail, ", ".join(to_mail), subject, body)
    try:
        server = SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login(mail_user, mail_pwd)
        server.sendmail(from_mail, to_mail, message)
        server.close()
        print("Successfully sent the mail")
    except:
        print("Failed to_mail send mail")

def backup_files():
    for f in files:
        shutil.copy("/home/acme/%s" % f, "/home/acme/%s.backup" % f)

def restore_backup():
    for f in files:
        shutil.copy("/home/acme/%s.backup" % f, "/home/acme/%s" % f)

def remove_backup():
    for f in files:
        os.remove("/home/acme/%s.backup" % f)

if __name__ == "__main__":
    try:
        backup_files()
        check_output("/root/newkeys.sh", timeout=1800, stderr=STDOUT)
        check_output('su acme -c "/home/acme/renew.sh"', timeout=600, stderr=STDOUT, shell=True)
        remove_backup()

        # certificate renewed, save date
        with open("/home/acme/days_left.txt","w") as f:
            now = datetime.now() + timedelta(days=90)
            f.write(now.strftime("%Y-%m-%d %H:%M:%S"))

        print("New keys active.")
    except CalledProcessError as error:
        restore_backup() # first, restore file, SMTP error won't break setup this way

        now = datetime.now()

        # get days remaining
        if os.path.isfile("/home/acme/days_left.txt"):
            remaining = 0
            with open("/home/acme/days_left.txt") as f:
                cert_issue_time = datetime.strptime(f.readline(), "%Y-%m-%d %H:%M:%S")
                cert_expire_time = cert_issue_time + timedelta(days=90)
                remaining = cert_expire_time - datetime.now()
                remaining = datetime(1,1,1) + remaining # convert to datetime object, http://stackoverflow.com/questions/4048651/
        else:
            remaining = datetime(90,1,1)

        # construct message
        subject = "%s example.com: LE certificate and key renewal failed. %d days remaning!" % (now.strftime("%Y-%m-%d %H:%M:%S"), remaining.day)
        body =  "On %s, the Let's Encrypt certificate renewal failed.\n" % now.strftime("%Y-%m-%d %H:%M:%S")
        body += "%d days remaining until certificate expires.\n" % (remaining.day-1)
        body += "Below is the output of the script for debugging.\n\n"
        body += "Return code: %d\n" % error.returncode
        body += "Output:\n"
        body += error.output.decode('utf-8')

        # send message
        send_email("example@gmail.com", "password", "recipient@domain.com", subject, body)

        print("Failed to apply keys.")
{{< /highlight >}}

This roughly has the same structure as `renew.py`. However, we need to backup the old keys in case something goes wrong. We had to add the call to `newkeys.sh` and change the call to `renew.sh`. This is required because we don't want `renew.py` to be run with root privileges! So we must switch the user to `acme` and execute the appropriate command, this is what `su acme -c "/home/acme/renew.sh"'` does.

Make both scripts executable:

{{< highlight shell >}}
chmod +x /root/newkeys.sh /root/newkeys.py
{{< /highlight >}}

Create a log file:

{{< highlight shell >}}
touch /var/log/newkeys.log
{{< /highlight >}}

Finally, add the python script to crontab. I opted to renew all keys every 6 months with the following line:

{{< highlight text >}}
0 0  5   5,11 *    /root/newkeys.py >> /var/log/newkeys.log 2>&1
{{< /highlight >}}

