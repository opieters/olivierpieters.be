---
title:  "Using CSS3 Counters for Figure and Table Numbering"
date:   "2016-08-23T16:29:00+02:00"
draft:  false
tags:   [Jekyll, Liquid, CSS, HTML, referencing]
---

Today I decided that all my figure-heavy posts will get proper captions and references. This makes referencing to a figure that is not directly below/above the text easier and more clear. A real referencing system as is present in LaTeX with `\ref` and `\label` is out of scope, but adding numbers to figure captions should be manageable, right?
<!--more-->

## The Path to a Solution

Figures, tables, captions... HTML turns out to be quite a mess in this regard. Did you know table captions are called `caption`, while figure captions are named `figcaption`, messy. I gets worse: `caption` must be the first descendant of `table` in order for it to be compliant with the HTML5 specification. `figcaption` on the other hand is allowed to be both the first and last descendant of `figure`. Nonetheless, I wanted to add numbers to these numbers.

With that idea in mind, I first turned to Liquid to solve the issue: use a global site variable and just increment that. To be more precise, created a file named `image.html` in the `_includes` folder with the following contents:

{{< highlight liquid >}}
<figure id="{{ include.alt | replace: ' ', '-' }}" class="centre-element {{ include.class }}">
    <img src="{{ include.src }}" alt="{{ include.alt }}"/>
    {% if include.caption %}<figcaption>Figure {{ site['fig_number'] }}: {{ include.caption }}</figcaption>{% assign site['fig_number'] = site['fig_number'] | plus: 1 %}{% endif %}
</figure>
{{< /highlight >}}

Added the following to my `_config.yml` file:

{{< highlight yaml >}}
fig_number: 1
{{< /highlight >}}

And added to following to include images on a page:

{{< highlight liquid >}}
{% assign site['fig_number'] = 1 %}
{% include image.html src='path/to/image1.jpg' alt='some alt' class='max-400px-wide' caption='A simple caption' %}
{% include image.html src='path/to/image2.jpg' alt='some alt' class='max-400px-wide' caption='A simple caption' %}

... (more figures)
{{< /highlight >}}

This does not work. One might have been tempted to write the following (the way these attributes are usually accessed):

{{< highlight liquid >}}
{% assign site.fig_number = site.fig_number | plus: 1 %}
{{< /highlight >}}

But no. This will never work because of how Liquid scopes work. You will just end up defining a variable named `site.fig_number` this way. After some more searching, I had to give this approach up. There just did not seem to be a way to redefine variables this was. I thought to make it a bit less elegant, by defining the variables inside the page:

{{< highlight liquid >}}
{% assign counter = 1 %}
{{< /highlight >}}

And then increment this counter, but the same problem occurred. So the counter needed to be incremented externally. I ended up with the following code in `image.html`:

{{< highlight liquid >}}
<figure id="{{ include.alt | replace: ' ', '-' }}" class="centre-element {{ include.class }}">
    <img src="{{ include.src }}" alt="{{ include.alt }}"/>
    {% if include.caption %}<figcaption>Figure {{ include.number }}: {{ include.caption }}</figcaption>{% endif %}
</figure>
{{< /highlight >}}

And to use it, I had to write:

{{< highlight liquid >}}
{% assign figure_number = 1 %}
{% include image.html src='path/to/image.jpg' alt='some alt' class='max-400px-wide' caption='A simple caption' number=figure_number %}{% assign figure_number = figure_number | plus: 1 %}

... (more {% include image.html %}s)
{{< /highlight >}}

This was just so unbelievably _ugly_, this really topped anything I had done before in my Jekyll website. This "working" solution is not only ugly, there is also so much code involved that should actually be hidden.

After some more thinking I remembered something: CSS3 counters! These provide a much more elegant solution, and who would have ever guessed CSS would result in something elegant?

## A More Elegant Solution: CSS Counters

A nice addition to CSS3 is CSS counters. The functionality is basic, but I works for this use case. What we first need to do, is write the proper SCSS:

{{< highlight scss >}}
body {
  counter-reset: figures;
  counter-reset: tables;
}

figure {
  figcaption::before {
    counter-increment: figures;
    content: "Figure " counter(figures) ": ";
  }
}

table {
  caption::before {
    counter-increment: tables;
    content: "Table " counter(tables) ": ";
  }
}
{{< /highlight >}}

Now, the accompanying HTML in `image.html`:

{{< highlight liquid >}}
<figure id="{{ include.alt | replace: ' ', '-' }}" class="centre-element {{ include.class }}">
    <img src="{{ include.src }}" alt="{{ include.alt }}"/>
    {% if include.caption %}<figcaption>{{ include.caption }}</figcaption>{% endif %}
</figure>
{{< /highlight >}}

Finally, we can add images:

{{< highlight liquid >}}
{% include image.html src='/path/to/image.svg' alt='alt and id' class='max-400px-wide' caption='An informative caption.' %}
{{< /highlight >}}


Well, that's it. This is much more elegant than the `{% assign counter = 'value' %}` solution I presented earlier. Although, you will still need to hard-code the numbers inside the text, it partially automates referencing.

## Extending the Numbering to Tables

Tables need a lot more content than figures, so a snippet in the `_include` folder will not work here. Since we have to add the entire table, the amount of effort to type the tags by hand is limited, and the CSS suffices to get the numbering.

Example code:

{{< highlight liquid >}}
<table>
  <caption>A table caption</caption>
  <tr>
      <th>Heading 1</th>
      <th>Heading 2</th>
  </tr>
  <tr>
      <td>Data 1</td>
      <td>Data 2</td>
  </tr>
  ...
</table>
{{< /highlight >}}
