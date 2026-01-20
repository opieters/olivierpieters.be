---
layout: page
title: Worth a Read
support: jquery
exclude_from_search: true
---

A collection of interesting blog posts, articles, videos and more that I think are very interesting and worth reading or viewing. Most articles are in English, but some are in Dutch.

<div class="center-element">
    <input type="text" id="search" placeholder="Search" autocomplete="off" class="search-box">
</div>

<div class="invisible-divider"></div>

<div id="results" class="search-results">
</div>

{% for category in site.data.worth-a-read %}
{{ category.title }}
<ul>
{% for item in category.entries %}
<li>{% if item.url %}<a href="{{ item.url }}">{% endif %}{{ item.title }}{% if item.url %}</a>{% endif %}
</li>
{% endfor %}
</ul>
{% endfor %}


<script src="/assets/js/lunr.js/lunr.min.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
// based on http://katydecorah.com/code/lunr-and-jekyll/ by Katy Decorah

var index = lunr(function () {
  this.field('title')
  this.field('url')
  this.field('category')
  this.field('language')
  this.ref('id')
});

{% assign count = 0 %}
{% for category in site.data.worth-a-read %}
{% for item in category.entries %}
index.add({
  title: {{ item.title | jsonify }},
  url: {{ item.url | jsonify }},
  category: {{ category | jsonify }},
  language: {{ item.language | jsonify }},
  id: {{ count }}
});
{% assign count = count | plus: 1 %}
{% endfor %}
{% endfor %}

var store = [{% for category in site.data.worth-a-read %}{% for item in category.entries %}
   {'title': {{item.title | jsonify}},
   'url': {{ item.url | jsonify }},
   'language': {{ item.language | jsonify }},
   'category': {{ category | jsonify }}
   },
  {% endfor %}{% endfor %}
]

// builds search
$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    // Get query
    var query = $(this).val();
    // Search for it
    var result = index.search(query);
    // Show results
    resultdiv.empty();
    // Add status
    resultdiv.prepend('<p class="search-count">Found ' + result.length + ((result.length>1 || result.length==0)  ? " results" : " result") + '</p>');
    // Loop through, match, and add results
    for (var item in result) {
      var ref = result[item].ref;
      console.log(store)
      var searchitem = '<div class="result"><div class="result-body"><a href="' + store[ref].url + '"class="search-title">' + store[ref].title + '</a></div>';
      resultdiv.append(searchitem);
    }
  });
});
</script>
