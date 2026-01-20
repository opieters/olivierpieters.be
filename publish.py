#!/usr/bin/env python3

__author__ = "Olivier Pieters"

from subprocess import check_output, STDOUT, CalledProcessError, call
from time import sleep
from multiprocessing import Process
import http.server, socketserver, os, requests, shutil
from bs4 import BeautifulSoup
import urllib

class Validator:
    """Checks HTML5/CSS3 resources of Jekyll blog before publication."""

    # global parameters
    upload_script = 'upload.sh'
    public_html = './public/'
    port = 4000
    source_url = "olivierpieters.be"

    def __init__(self, config_file="_config.yml", force=False, ignore=None):
        """Constructor.

        Keyword arguments:
        config_file -- is the Jekyll configuration file.
        force       -- upload, even if errors occurred.
        ignore      -- files/directories to be ignored by validator.
        """
        self.original_conf = []
        self.new_config = []
        self.config_file = config_file
        self.force = force
        self.ignore = ignore

    def clean(self):
        """Clean all resources."""
        check_output(["jekyll", "clean"])
        if os.path.isdir(".asset-cache"):
            shutil.rmtree(".asset-cache")

    def update_configuration(self):
        """Update development configuration to build configuration."""
        # read current configuration and build new one
        return
        with open(self.config_file, 'r') as f:
            for line in f:
                if "analytics: false" in line:
                    self.new_config.append("analytics: true\n")
                elif "integrity: false" in line:
                    self.new_config.append(line.replace("integrity: false", "integrity: true"))
                else:
                    self.new_config.append(line)
                if "- assets/images/photography" in line:
                    self.new_config.append("\n")
                self.original_conf.append(line)

        # save new configuration to file
        with open(self.config_file, 'w') as f:
            for line in self.new_config:
                f.write(line)

    def reset_configuration(self):
        """Reset build configuration to development configuration."""
        return
        with open(self.config_file, 'w') as f:
            for line in self.original_conf:
                f.write(line)

    def run_server(self):
        """Start HTTP server on port 4000."""
        os.chdir(os.path.join(Validator.public_html))
        handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", Validator.port), handler)
        httpd.serve_forever()

    def validate(self):
        """Validates all files in public_html directory."""
        self.update_configuration()
        self.build()
        print("Built website")

        p = Process(target=self.run_server)
        p.start()

        test = True
        try:
            if self.ignore is None:
                check_output(['html5validator --root %s' % Validator.public_html], shell=True, stderr=STDOUT)
            else:
                check_output(['html5validator --root %s --ignore %s' % (Validator.public_html, self.ignore)], shell=True, stderr=STDOUT)
        except CalledProcessError as error:
            print("Failed to pass HTML5 validation")
            print("Return code: %d" % error.returncode)
            print("Output:")
            print(error.output)
            if self.force == False:
                test = False
        p.terminate()
        self.reset_configuration()
        return test

    def publish(self):
        """Publish website to hosting service."""
        check_output(["./%s" % Validator.upload_script], shell=True)

    def build(self):
        """Build Jekyll website."""
        check_output(["JEKYLL_ENV=production jekyll build"], shell=True)

    def check_links(self):
        http_url = "http://" + Validator.source_url
        https_url = "https://" + Validator.source_url
        to_check = [https_url]
        checked, non_rec, error_pages = [], [], []
        while len(to_check) > 0:
            current_link = to_check.pop()
            try:
                resp = urllib.request.urlopen(current_link)
                if resp.info().get_content_type() != 'text/html':
                    continue
                soup = BeautifulSoup(resp, 'html.parser', from_encoding=resp.info().get_param('charset'))
                for link in soup.find_all('a', href=True):
                    url = link['href']
                    if url.startswith("/") or url.startswith(https_url) or url.startswith(http_url) or url.startswith("#"):
                        if url.startswith("/") and not url.startswith("//"):
                            url = https_url + url
                        if url.startswith("#"):
                            if "#" in current_link:
                                base_link = current_link[:current_link.rfind("#")]
                            else:
                                base_link = current_link
                            url = base_link + url
                        if url not in checked and url not in to_check:
                            to_check.append(url)
                    else:
                        if url not in non_rec:
                            non_rec.append(url)
            except urllib.error.URLError:
                print("Error url: %s" % current_link)
                error_pages.append(current_link)

            print("To do: %d links." % len(to_check))
            checked.append(current_link)

        print("Checking %d external links." % len(non_rec))
        while len(non_rec) > 0:
            current_link = non_rec.pop()
            try:
                resp = urllib.request.urlopen(current_link)
            except urllib.error.URLError as e:
                print("Error url: %s" % current_link)
                print(e)
                error_pages.append(current_link)

        print("Checked %d internal links." % len(checked))
        print("Checked %d links contained errors." % len(error_pages))

if __name__ == '__main__':
    v = Validator(ignore='assets google35ed0a70ab9e98fa.html')
    print("Cleaning directories...")
    v.clean()
    print("Validating...")
    if v.validate():
        print("HTML5 checks OK.")
        #v.publish()
        print("Uploaded website.")
    else:
        print("Failed to upload website.")

    print("Checking URLs on live website...")
    v.check_links()
