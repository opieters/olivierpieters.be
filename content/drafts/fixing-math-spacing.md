---
layout: post
title: "Fixing Math Spacing"
support: math
draft: true
---

When writing the blogpost about mathematics in LaTex, I noticed an anomaly in the spacing used after functions such as `\cos` in combination with my own command `\br`. At the time of writing, I did not really mind it, but the more I notices, the more I got annoyed by it. But for (almost) every LaTeX problem, there exists a solution!

First of all, the error would never have occurred if I just wrote the following:

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\cos(2\pi x)`
  </div>
  <div class="half-width h-center-text">
  $$\cos(2\pi x)$$
  </div>
</div>

instead of:

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\cos\br{2\pi x}`
  </div>
  <div class="half-width h-center-text">
  $$\newcommand{\br}[1]{\left(#1\right)}\cos\br{2\pi x}$$
  </div>
</div>

Where `\br` is defined as follows: `\newcommand{\br}[1]{\left(#1\right)}`

Would it also occur with `\left` and `\right` directly?

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\cos\left(2\pi x\right)`
  </div>
  <div class="half-width h-center-text">
  $$\cos\left(2\pi x\right)$$
  </div>
</div>

So, the problem is not really specific to _my_ function, but to any function really. How do we solve it? We could surround different expressions with curly brackets to convert them to math atoms$$\cos\br{x}$$:

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\cos\br{x}`
  </div>
  <div class="half-width h-center-text">
  $$\cos\br{x}$$
  </div>
</div>
<div markdown="1" class="h-center-text">

</div>

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\cos{\br{x}}`
  </div>
  <div class="half-width h-center-text">
  $$\cos{\br{x}}$$
  </div>
</div>

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `{\cos}\br{x}`
  </div>
  <div class="half-width h-center-text">
  $${\cos}\br{x}$$
  </div>
</div>

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `{\cos}{\br{x}}`
  </div>
  <div class="half-width h-center-text">
  $${\cos}{\br{x}}$$
  </div>
</div>
<div markdown="1" class="h-center-text">

Notice that _only_ that final attempt: converting _both_ to math atoms works! How do we apply this knowledge? Redefine all existing math expressions form AmsMath? Always add the curly bracktes? Define new functions?

I personally prefer the last suggestions, because it works well with existing code and has the most versatility. What we will do, is define new functions for `exp`, `\cos`... and also add some useful math things for integrals and derivatives.

We will start by defining fixed versions of the existing commands (`f` for _fixed_):
`\newcommand{\fcos}{{\cos}}`.

Now we can use these, just like before:

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\fcos\br{x}`
  </div>
  <div class="half-width h-center-text">
  $$
  \newcommand{\fcos}{{\cos}}
  \fcos\br{x}
  $$
  </div>
</div>
<div markdown="1" class="h-center-text">

We can extend this to other functions such as `\exp`, `\log` and so on.

Let's fix another common annoyance: deriviatives and integers

We will define a differential `\dd` as follows:

`\newcommand{\dd}[1][]{
  {\mathrm{d}^{#1}#2}
}`

We can use this for integrals and derivatives:

<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\dfrac{\dd{f\br{x}}}{\dd{x}}`
  </div>
  <div class="half-width h-center-text">
  $$\newcommand{\dd}[1]{{\mathrm{d}{#1}}}
  \dfrac{\dd{{f}(x)}}{\dd{x}}
  $$
  </div>
</div>
<div  class="row">
  <div markdown="1" class="half-width h-center-text">
  `\int_0^\infty f\br{x} \dd{x}`
  </div>
  <div class="half-width h-center-text">
  $$
  \int_0^\infty f\br{x} \dd{x}
  $$
  </div>
</div>
