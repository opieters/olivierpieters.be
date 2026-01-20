var yaml = require("yamljs");
var S = require("string");
var conzole = require("conzole");

var CONTENT_PATH_PREFIX = "../../content";

var counter = 0;
var dont_process_layouts = ["gallery"];

module.exports = function(grunt) {

    grunt.registerTask("lunr-index", function() {

        grunt.log.writeln("Build pages index");

        var indexPages = function() {
            var pagesIndex = [];
            grunt.file.recurse(CONTENT_PATH_PREFIX, function(abspath, rootdir, subdir, filename) {
                var pageIndex;
                grunt.verbose.writeln("Parse file:",abspath);
                pageIndex = processFile(abspath, filename);
                if (pageIndex != null){
                    pagesIndex.push(pageIndex);
                }
            });

            return pagesIndex;
        };

        var processFile = function(abspath, filename) {
            var pageIndex;

            console.log("Processing", abspath);

            if (S(filename).endsWith(".html")) {
                pageIndex = processHTMLFile(abspath, filename);
            } else if (S(filename).endsWith(".md")) {
                pageIndex = processMDFile(abspath, filename);
            }

            return pageIndex;
        };

        var processHTMLFile = function(abspath, filename) {
            var content = grunt.file.read(abspath);
            var pageName = S(filename).chompRight(".html").s;
            var href = S(abspath)
                .chompLeft(CONTENT_PATH_PREFIX).s;
            return {
                title: pageName,
                href: href,
                tags: [],
                date: "",
                content: S(content).trim().stripTags().stripPunctuation().s,
                id: counter
            };
        };

        var processMDFile = function(abspath, filename) {
            var content = grunt.file.read(abspath);
            var pageIndex;
            // First separate the Front Matter from the content and parse it
            content = content.split("---");
            var frontMatter;
            try {
                frontMatter = yaml.parse(content[1].trim());
            } catch (e) {
                grunt.log.error(e.message());
            }

            if(("draft" in frontMatter) && (frontMatter.draft)){
                return null;
            }
            if(("exclude_from_search" in frontMatter) && (frontMatter.exclude_from_search)){
                return null;
            }
            if(("layout" in frontMatter) && (dont_process_layouts.indexOf(frontMatter.layout) > -1)){
                return null;
            }

            var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;
            // href for index.md files stops at the folder name
            if (filename === "index.md") {
                href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
            }

            var date = frontMatter.date;
            date = date.split("T")[0];

            if(S(abspath).indexOf("/blog/") > 0){
                href = "/blog/" + date.replace(/-/g, "/") + "/" + frontMatter.title.toLowerCase().replaceAll(" ", "-");
            }

            

            // Build Lunr index for this page
            pageIndex = {
                title: frontMatter.title,
                tags: frontMatter.tags,
                href: href,
                date: date,
                content: S(content[2]).trim().stripTags().stripPunctuation().s,
                id: counter
            };

            counter += 1;

            return pageIndex;
        };

        grunt.file.write("../../static/js/lunr/PagesIndex.json", JSON.stringify(indexPages()));
        grunt.log.ok("Index built");
    });
};
