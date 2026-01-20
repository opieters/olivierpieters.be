---
layout:    default
title:     "Reizen naar Noorwegen"
support:   maps
exclude_from_search: true
---

Lijst van interessante bezienswaardigheden in het Zuiden van Noorwegen.

<div id="map{{ include.id_number }}" class="map"></div>

{% assign count = 1 %}
{% for layer in site.data.noorwegen-2017.layers %}
<h2>{{ layer.title }}</h2>
{% for item in layer.items %}
{% if item.link %}
<h3 id="#{{item.title | slugify }}"><a href="{{ item.link}}">{{ item.title }}</a></h3>
{% else %}
### {{ item.title }}
{% endif %}

{{ item.description }}

{% if item.location %}
<div class="centre-element">
  <button id="map-{{count}}" type="button" class="button-active">toon op kaart</button>
</div>
{% endif %}

{% assign count = count | plus:1 %}
{% if item.image %}
<div class="centre-element">
  <img class="travel-image" src="{{ item.image }}" alt="{{ item.title | escape }}"/>
</div>
<div class="divider"></div>
{% endif %}
{% endfor %}
{% endfor %}

<script src="/assets/travel/noorwegen-2017.js"></script>
