---
layout: default
title: Travelling to Wales
support: [maps]
json_data: travel/wales-2016
exclude_from_search: true
---

A list of interesting thins to consider during our trip to Wales.

<div id="map{{ include.id_number }}" class="map"></div>

{% assign count = 1 %}
{% for layer in site.data.wales-2016.layers %}
<h2>{{ layer.title }}</h2>
{% for item in layer.items %}
{% if item.link %}
### [{{ item.title }}]({{ item.link}}) {#{{item.title | slugify }}}
{% else %}
### {{ item.title }}
{% endif %}

{{ item.description }} {% if item.location %}<button id="map-{{count}}" type="button">map</button>{% endif %}
{% assign count = count | plus:1 %}
{% endfor %}
{% endfor %}

## Heritage walks on Wales Coast Path

It’s not just gorgeous scenery and wildlife that’s on show on the 870 mile Wales Coast Path. Thousands of years of history and Welsh heritage come alive on these short walks around our coast. [10 great walks](http://www.visitwales.com/things-to-do/activities/walking-hiking/wales-coast-path/wales-coast-path-heritage).

[Pembrokeshire Coast Path: 2nd best coastal walk in the world](http://www.visitwales.com/things-to-do/activities/walking-hiking/pembrokeshire-coast-path)
