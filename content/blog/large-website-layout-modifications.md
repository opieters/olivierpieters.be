---
title:  Large Website Layout Modifications
date:   "2016-02-13T18:36:00+01:00"
draft:  false
tags:   [website, layout update]
---

It has been quite some time since my last change to the HTML/CSS layout. But the wait has been worth it! Over the past two months I have been redesigning several aspects of the website to make them even more awesome!
<!--more-->

The most notable changes will be the full-width image on the homepage and the redesigned menu. I wanted to use a new style of menu that works well on both mobile and desktop and was a bit fancier than my current design.

After an extensive and exhausting search, I ended up discovering {{< blank_url "slideout.js" "https://slideout.js.org" >}}. slideout.js is a plug-in free JavaScript library for building menus. This plug-in free feature is very important to me, since I did not want to include jQuery on every page on my website.

Tags associated to posts are now also visible. Previously, tags were only visible if they were associated to a project. Blog posts' tags are also clickable. This feature is part of the new archives system I use.

Based on some feedback I received, I also include {{< blank_url "Disqus comments" "https://help.disqus.com/customer/portal/articles/472138-jekyll-installation-instructions" >}}. The website remains statically built with Jekyll, but commenting is now possible if your browser supports JavaScript. In addition to comments, I also added Google Analytics. Both these additions are inspired by a blogpost by Joshua Lande (webpage is not online anymore).

Finally, the blog is now indexed and searchable with {{< blank_url "lunr.js" "https://github.com/olivernn/lunr.js" >}}. The design and use of lunr.js are based on {{< blank_url "this blogpost" "http://katydecorah.com/code/lunr-and-jekyll/" >}} by Katy Decorah. Take a look at the {{< blank_url "search page" "/search/" >}}.