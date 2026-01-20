---
layout: post
title: "Designing a Curriculum Vitæ in LaTeX – Part 1: Concept and General Design"
tags: [limecv, curriculum vitae, LaTeX, TikZ]
date:     "2017-09-12T21:10:00+02:00"
slug: "designing-a-cv-in-latex-part-1"
---

About half a year ago, I posted a blog post on [how I created my business card]({{< ref "/blog/designing-a-business-card-in-latex/index.md" >}}). This post was my most popular post to date. It was even the most tending post for a few hours on [Hacker News](https://news.ycombinator.com). Lots of people were asking about my curriculum vitæ (CV) design, but to be honest, I was using the [`moderncv` document class](https://www.ctan.org/pkg/moderncv?lang=en) at the time. After finishing my dissertation and graduating, I've found the time to fully design my own CV and this is the result:

<!--more-->

<div class="row">
  <div class="six columns">
    <figure id="cv-page-1" class="centre-element">
      {{< fig file="limecv_main.svg" id="cv-main-layout" alt="CV front page" imgClass="frame" class="centre-element max-500px-wide">}}
    </figure>
  </div>
  <div class="six columns">
    <figure id="cv-cover-letter" class="centre-element">
        {{< fig file="cover_letter.svg" id="cv-main-sidebar" alt="CV cover letter" imgClass="frame" class="centre-element max-500px-wide">}}
    </figure>
  </div>
</div>
<!-- maybe add modals based on https://www.w3schools.com/howto/howto_css_modal_images.asp -->

## Introduction

I took the time to design my own template. In this series of four blog post, I will detail the design as a standard document. However, I've also converted the design to a document class. This should make it easier for others to use this template. If you're only interested in using the document class, you should check the [GitHub repository](https://github.com/opieters/limecv) and [package documentation](http://ctan.org/tex-archive/macros/latex/contrib/limecv/limecv.pdf).

As highlighted in the business card post, one might wonder why bother doing this in LaTeX, a typesetting system that is notorious for its quirks and dirty hacks to make it produce the desired output. The answer is: why not? (La)TeX is open source, available on all major platforms, and the fact that it's a pain in the ass sometimes makes it all the more challenging and fun to do.

This first blog post will be about the general design considerations. Next, we will design the sidebar in a dedicated post, followed by the main section. This section will contain details about interests, experience and education. Finally, we'll also add a cover letter design. 

## About the Layout: Overall Style Ideas

<div class="row">
  {{< column "six" >}}
From the very beginning, I knew I wanted to have a two-column layout: one column for personal details such as name, position, languages, etc. And one for the "main" content such as education and experience. It also has to match the business card I've previously designed, so we'll use the same colour/font combination.

An overview of the layout structure, widths and margins can be found <span class="only-desktop">to the right</span><span class="only-mobile">below</span>. We'll immediately be using proper length variables, since that makes iterating way faster!

As one can see in this figure, we have defined three new lengths: `\margin`, `\mainwidth` and `\sidewidth`. `\paperwidth` and `\paperheight` are LaTeX built-ins and set using appropriate options passed to the geometry package. From the relationship between all three lengths, we can deduce that `\mainwidth` is `\paperwidth-\sidewidth-4\margin`.

We will be designing a regular CV, so A4 paper is the target size. We will set the margin to 1&nbsp;cm here, to maximise information density on the first page. The base preamble looks as follows:
  {{< /column >}}
  <div class="six columns">
        {{< fig file="limecv-layout.svg" id="cv-margins" class="centre-element" alt="CV margins" imgClass="frame" >}}
  </div>
</div>

{{< highlight latex >}}
% !TEX TS-program = xelatex
% !TEX encoding = UTF-8 Unicode

\documentclass[11pt]{article}

\usepackage{calc}

% define length
\newlength\margin
\setlength\margin{1cm}

% set a4paper width minimal options
\usepackage[margin=\margin,noheadfoot,a4paper]{geometry}

% define more lengths
\newlength\sidewidth
\setlength\sidewidth{0.3\paperwidth-\margin}

\newlength\mainwidth
\setlength\mainwidth{\paperwidth-4\margin-\sidewidth}
{{< /highlight >}}

The basic preamble is fairly standard. One unusual package my be the `calc` package which redefines `\setlength`. We can now make use of more complicated expressions and arithmetic to set lengths and not only use hard-coded numbers.

Notice that we are using the XeTeX compiler. This compiler is needed for some of the features we will use in the subsequent sections such as font loading and minor spacing corrections. We will correct some of the left and right side-bearings of some characters. As a result, we require a recent version of XeTeX (the code is not compatible with regular LaTeX nor with LuaTeX). 

We will be using a similar colour palette as for the business card, but instead of using `!30` to make the colour lighter, I've opted to use a dedicated colour that is slightly more saturated than the previous version. The business card can be easily adopted to match this colour.

<div class="invisible-divider"></div>
<div class="row colour_palette">
  <div class="three columns dark">#2F3142<br/>C29 M26 Y0 K74</div>
  <div class="three columns light_dark">#474A65<br/>C30 M27 Y0 K60</div>
  <div class="three columns green">#357F2D<br/>C58 M0 Y65 K50</div>
  <div class="three columns light_green">#B8E4B3<br/>C19 M0 Y21 K11</div>
</div>
<div class="invisible-divider"></div>

By now, we know the overall layout and the colour palette that we're going to use. In the next blog post we will start the actual implementation by designing the sidebar.
