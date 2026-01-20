---
title:  "Fixing Xfig Fonts"
draft:  false
date:   "2015-11-28T09:11:01+01:00"
tags:   [Xfig, Linux]
---

Xfig is a nice little Linux programme for creating vector graphics. It takes some getting used to, but once you know some quirks and conventions, it is pretty easy to work with. The best thing about it is: it allows you to export SVG and EPS. This way, you can create nice vector graphics for your documents, even if you don't know (or want to learn) TikZ.
<!--more-->

However, when I used it on my Linux computer, I was unable to change the font and font size. After some time in the command line and asking a question to our good friend Google, I concluded that I missed an X11 package: `gsfonts-x11`. Running `sudo apt-get install gsfonts-x11` solved the issue.
