---
title:    Designing a Business Card in LaTeX
date:     "2017-02-11T17:30:00+01:00"
draft:    false
tags:     [LaTeX, business card, TikZ]
category: LaTeX
---

In 2017, I will graduate from {{< blank_url "Ghent University" "https://www.ugent.be" >}}. This means starting a professional career, either in academia or in industry. One of the first things that came to mind was that I needed a good curriculum vitæ, and a business card. I <a href="{{< ref "/curriculum-vitae/_index.md" >}}">already have the former</a>, but I still needed a business card. Consequently, I looked a bit online and was not all that impressed by the tools people used to design them. I did not want to change some template everybody's using, but do my own thing. And suddenly, I realised: what better tool than LaTeX to make it!
<!--more-->

I know, I already hear some saying "why not use the online tools?" or "Photoshop?". I picked LaTeX because I want to have a platform independent implementation and because why not? I really like making LaTeX documents, so this seemed like something other than creating long documents.

So, how are we going to create it? First, we'll make a template for the front and back sides. Then, we will modify this to our needs and have a perfectly formatted and aligned business card.

<div class="tldr">
  <p>Checkout the <a href="https://github.com/opieters/business-card" target="_blank">GitHub repository</a>.</p>
</div>

## Designing the Template

Before we start creating our business card, we first need to make some design choices. This includes fonts and colours we are going to use. We will employ custom fonts, so the XeLaTeX compiler is needed. I've chosen for the {{< blank_url "Fira font from Mozilla" "https://github.com/mozilla/Fira" >}}. Make sure you have the font (or change the code of course) correctly installed on your system before continuing. You will also need to install {{< blank_url "FontAwesome" "http://fontawesome.io" >}} on your system. More on that later.

To make our card a bit more attractive, we are also going to add some colour. These are the three colours we will use here:

<div class="invisible-divider"></div>
<div class="row colour_palette">
  <div class="four columns dark">#2F3142</div>
  <div class="four columns light_dark">#474A65</div>
  <div class="four columns green">#357F2D</div>
</div>
<div class="invisible-divider"></div>

They are not really eye-popping, but I don't think that's needed either. The two darker colours will be used for the text and the green one for small divider lines. To select these, I really like to use {{< blank_url "ColorHexa" "http://www.colorhexa.com/" >}} (a colour picker).

Now, it's time to start writing some LaTeX. This is the minimal template we'll use for the design:

{{< highlight latex >}}
% !TEX TS-program = xelatex
\documentclass[10pt,oneside,final]{article}
\usepackage{tikz}

\begin{document}
  \thispagestyle{empty}
  \vspace*{\fill}
  \begin{center}
    \begin{tikzpicture}
      % definition of the actual layout
    \end{tikzpicture}
  \end{center}
  \vspace*{\fill}
\end{document}
{{< /highlight >}}

We use the `article` class, load TikZ, center the picture and vertically align the TikZ environment using `\vspace*{\fill}`. We also remove the page numbers with `\thispagestyle{empty}`. We will need some additional commands that set predefined margins to zero. However, first we will defined that card size. 

There are lots of business card sizes. Here, we will use the format most used in the US and Canada: 3.5x2 inches. In other countries, the size may differ. Check yours on {{< blank_url "Wikipedia" "https://en.wikipedia.org/wiki/Business_card#Dimensions" >}}.

We set the proper size using the `geometry` package:

{{< highlight latex >}}
% set all margins to 0 and set business card size
\usepackage[paperwidth=2in,paperheight=3.5in,margin=0cm,noheadfoot]{geometry}
{{< /highlight >}}

We also removed the header and footer and all possible margins to fully use the card.

We also have to set the default baseline size and the distance between header and text of the page to zero. Just in case, we will also remove the paragraph indents (this is not really needed):

{{< highlight latex >}}
\setlength{\baselineskip}{0cm} % between baselines
\setlength{\topskip}{0pt}      % between header and text
\usepackage{parskip}           % remove paragraph indents
{{< /highlight >}}

Now, `\vspace*{\fill}` will indeed result in a perfectly centred `tikzpicture`.

Since we want to load custom fonts (XeLaTeX ❤️), we will also load these two packages:

{{< highlight latex >}}
\usepackage{fontspec}          % load external fonts
\usepackage{fontawesome}       % icon font
{{< /highlight >}}

FontAwesome is loaded by the `fontawesome` package. As a result, it needs to be installed on your system as well. This packages defines all sorts of icons that can be inserted by means of `\fa<name>` where `<name>` is a description fot the icon. An anchor is for instanstace inserted by typing `\faAnchor`.

We load the font of choice:

{{< highlight latex >}}
% load external font
\setmainfont[Numbers={OldStyle,Monospaced}]{Fira Sans}
\setsansfont{Fira Sans}
\setmonofont{Fira Mono}
{{< /highlight >}}

If you want to use more than one font, it's easiest to do this by defining a new font family:

{{< highlight latex >}}
\newfontfamily\anotherfont[<features>]{<name>}
{{< /highlight >}}

Changing the font is easy now: just add `\anotherfont` where the font should be applied. A long how-to that explains all about fonts in different flavours of (La)TeX can be found {{< blank_url "here" "http://tex.stackexchange.com/questions/25249/how-do-i-use-a-particular-font-for-a-small-section-of-text-in-my-document" >}}.

Now, it's time to load our drawing package TikZ's libraries and define our colours:

{{< highlight latex >}}
% load and configure tikz libraries
\usetikzlibrary{matrix,positioning,calc}

\usepackage{xcolor}                        % more colour options

\definecolor{seplinecolour}{HTML}{357f2d}  % green
\definecolor{iconcolour}{HTML}{2f3142}     % dark
\definecolor{textcolour}{HTML}{2f3142}     % dark
\definecolor{jobtitlecolour}{HTML}{474a65} % light dark
{{< /highlight >}}

The above colour commands only define new colours. We still need to use them. The darkest one will be used for the text in stead of pure black. Pure black is has a very high contrast with the white background, that's why we are using a slightly lighter colour. To avoid having to change the colour multiple times, we can modify the global text colour with the following command ({{< blank_url "source" "http://tex.stackexchange.com/questions/26549/how-do-i-globally-set-the-text-color-in-xelatex" >}}):

{{< highlight latex >}}
% change global colour
\makeatletter
\newcommand{\globalcolor}[1]{%
  \color{#1}\global\let\default@color\current@color
}
\makeatother
\AtBeginDocument{\globalcolor{textcolour}}
{{< /highlight >}}

Hard coding the spacing between different elements is quicker for the initial design, but it's much slower for fine tuning it at the end. So, we'll immediately use length variables to hold our spacing definitions. Here's a template. We will use this to define length variables for the font and back sides.

{{< highlight latex >}}
% define some lengths for internal spacing
\newlength{\somelength}
\setlength{\somelength}{2cm}
{{< /highlight >}}

By now, the preamble contains all the global variables for both the front and back sides. Additionally, we also have laid out the basics for the document contents. Let's start adding the actual content!

## Front Side

<div class="row">
  <div class="eight columns">
    <p>The front side is obviously the most important side, since it'll contain your name, job title, contact information, etc. Before starting on the actual layout, we need to get an idea on the layout we want to create. For inspiration, one can always search sites such as {{< blank_url "Pinterest" "https://www.pinterest.com/search/pins/?q=business%20card" >}} to find interesting designs and modify these to make them your own. Be aware of licensing on the content you are using though!</p>

    <p>Here, we'll not make a too complicated card. The general layout will be a stacked one where we will separate each section with a small line. It will look somewhat like this figure.</p>

    <p>Because we're working with these stacked-like structure, we can work with the very convenient `matrix` construct from TikZ. This basically allows to group nodes and drawings in a table-like structure. The syntax is very straightforward if you're familiar with TikZ and tabular.</p>
  </div>
  <div class="four columns">
  {{< fig file="business-card-outline.svg" alt="business card front" imgClass="frame centre-element max-300px-wide" id="business-card-outline">}}
  </div>
</div>

Here's an example taken from the TikZ manual:

{{< highlight latex >}}
\matrix[fill=red!20] (label) at (2,1) {
    \draw (0,0) circle (4mm);   & \node[rotate=10] {Hello};        \\
    \draw (0.2,0) circle (2mm); & \fill[red]   (0,0) circle (3mm); \\
};
{{< /highlight >}}

As can be seen in the above example, a matrix behaves like a node, having a location,  an optional location reference and a label that contains our grid. Each cell has its own coordinate space, and will be aligned as a table. This means the row separator is `\\` and the column separator is `&`.

Before starting the actual implementation, we will define some spacing variables. These will come in handy later on.

{{< highlight latex >}}
% define some lengths for internal spacing
\newlength{\seplinewidth}    \setlength{\seplinewidth}{2cm}
\newlength{\seplineheight}   \setlength{\seplineheight}{1pt}
\newlength{\seplinedistance} \setlength{\seplinedistance}{0.3cm}
{{< /highlight >}}

Now applying this design to our business card, we obtain the following name and title section:

{{< highlight latex >}}
\matrix[every node/.style={anchor=center,font=\huge},anchor=center] (name) {
  \node{John}; \\
  \node{Doe}; \\
  \node{\color{jobtitlecolour}\normalsize\textit{job title}}; \\
};
{{< /highlight >}}

This adds the given name, surname and job title in a single column and applies the same options to each of them. The options are set using `every node/.style`, this is more convenient that doing adding these per node (e.g. `\node[anchor=center,font=\huge]{John};`). Finally, we also set the anchor of the matrix-node to its centre (not really needed, but this might be convenient in some situations).

Now, a small side note on the job title. We added some additional commands to its label to change the formatting. First, we changed the font colour from the default one to a the `jobtitlecolour` colour (defined above). This makes the name and title sections stand better apart. Furthermore, we also changed to font size from `\huge` to `\normalsize` or `10pt`.

Next, let's add the bar to separate the identity section from the contact section by means of a horizontal bar. We will use our predefined spacing lengths to specify the length between the identity node, the bar and the contact information maxtrix node (see below).

{{< highlight latex >}}
\node[below=\seplinedistance of name] (hl1) {};
\draw[line width=\seplineheight,color=seplinecolour] (hl1)++(-\seplinewidth/2,0)
  -- ++(\seplinewidth,0);
{{< /highlight >}}

First, we define a helper node `hl1`. This node will be located `\seplinedistance` below the souther anchor of our identity node (`name`). Then, we use this to draw the line. `(hl1)++(-\seplinewidth/2,0)` creates an unnamed node that is located `\seplinewidth/2` to the left of `hl1`. Then we start drawing the line (`--`) till we reach the next node. This is again a relative unnamed node located `\seplinewidth` to the right of the _previous_ node (i.e. our other unnamed node). Consequently, it will be located `\seplinewidth/2` to the right of `hl1`.

The contact information matrix-node looks like this:

{{< highlight latex >}}
\matrix [below=\seplinedistance of hl1,
         column 1/.style={anchor=center,color=iconcolour},
         column 2/.style={anchor=west}] (contact) {
  \node{\faGlobe}; & \node{johndoe.com};\\
  \node{\faEnvelope}; &\node{me@johndoe.com};\\
  \node{\faPhone}; &\node{+1 781 555 1212}; \\
  \node{\faGithub}; &\node{johndoe}; \\
};
{{< /highlight >}}

Again, we use relative spacing to get the distances right. This time however, we are using the different options depending on the column the nodes are located in. This is needed to properly align everything.

We also need to add a separator to separate the the contact information section from our next section: the interests section. The code is almost identical to the previous separator line:

{{< highlight latex >}}
\node[below=\seplinedistance of contact] (hl2) {};
\draw[line width=\seplineheight,color=seplinecolour] (hl2)++(-\seplinewidth/2,0)
  -- ++(\seplinewidth,0);
{{< /highlight >}}

<div class="row">
  <div class="eight columns">
    <p>Lastly, the interests section. We will use graphical symbols to depict some of out major interests or passions. These can be arranged into a two rows or one, depending on the amount you want to include. Here, I've picked five icons and they work best if used in a single row.</p>

{{< highlight latex >}}
% interests
\matrix [below=\seplinedistance of hl2,
         every node/.style={anchor=center,font=\LARGE}]
         (interests) {
  \node{\faCode}; & \node{\faCoffee}; &
  \node{\faLock}; & \node{\faWrench}; &
  \node{\faCameraRetro}; \\
};
{{< /highlight >}}

    <p>After combining all of this, we obtain the final result.</p>
  </div>
  <div class="four columns">
    {{< fig file="business-card-front" alt="business card front" imgClass="frame" class="centre-element max-300px-wide" id="business-card-front">}}
  </div>
</div>

## Back Side

The front side is the more important one, but leaving the back side blank is a missed opportunity. Why not add an image, logo or QR-code? Here, we'll add a QR-code and logo to add more useful information. Again, we will start from the basic template we created in the first section.

To add external images and the QR-code, we need to load these additional packages:

{{< highlight latex >}}
\usepackage{graphics}        % load images
\usepackage[nolinks]{qrcode} % create QR codes
{{< /highlight >}}

Of course, it's also possible to include an externally generated QR-code, but make sure it is a vector image. Otherwise, it might not be sharp enough for printing.

The lengths and colours below define the styling options. Notice that we are using pure black in this case for the text. This is to make sure the contrast in the QR-code is qas high as possible.

{{< highlight latex >}}
\newlength{\qrheight}   \setlength{\qrheight}{1in}
\newlength{\edgemargin} \setlength{\edgemargin}{0.2in}
\newlength{\logowith}   \setlength{\logowith}{0.5in}

\definecolor{bordercolour}{HTML}{357f2d}  % green
\definecolor{textcolour}{HTML}{000000}    % black

\makeatletter
\newcommand{\globalcolor}[1]{%
  \color{#1}\global\let\default@color\current@color
}
\makeatother
\AtBeginDocument{\globalcolor{textcolour}}
{{< /highlight >}}

That's it for the preamble. Now, let's more to the actual contents. Again, we are using a `tikzpicture` to draw everything on the card. But this time, we are going to use that are not relative to the picture alone. To this end, we need to add these options to our `tikzpicture` environment: `remember picture,overlay,`. This will make it possible to use `current page.center` during positioning.  
To add some colour to the back side, we are going to draw a border frame in green and fill it with a light green colour that is derived from the green border colour:

{{< highlight latex >}}
\draw[fill=bordercolour!30,draw=bordercolour] (current page.center)
  ++(-\paperwidth/2+\edgemargin,\paperheight/2-\edgemargin) rectangle
  ++(\paperwidth-2*\edgemargin,-\paperheight+2*\edgemargin);
{{< /highlight >}}

To add a logo, we can use the following snippet:

{{< highlight latex >}}
% logo
\draw (current page.center)
  ++(0,\paperheight/2-\edgemargin-\paperwidth/2+\edgemargin+\logowith/2)
  node (helper logo) {};
\node[anchor=north] at (helper logo) {\includegraphics[width=\logowith]{figures/logo}};
{{< /highlight >}}

This will include the logo image file from the `figures/` directory with a width of `\logowith`. It is assumed that the image dimensions are the same.

The final thing to add is the QR-code. A QR-code can contain various types of data such as images, text, but also a {{< blank_url "vCard" "https://en.wikipedia.org/wiki/VCard" >}}. A vCard is a standardised format for business cards and enables people to instanty add you to their contacts. It's more powerful than including a link to a curriculum vitae in my opinion.

A vCard example:

{{< highlight latex >}}
% qr code
\draw (current page.center)
  ++(0,-\paperheight/2+\edgemargin+\paperwidth/2-\edgemargin-\qrheight/2)
  node (helper qr) {};
\node[anchor=south] at (helper qr)
  {\qrcode[level=M,height=\qrheight]{BEGIN:VCARD
VERSION:3.0
N:John;Doe;;Mr.
FN:Mr. John Doe
TITLE:CEO Doe Enterprises
ORG:Doe Enterprises
PHOTO;VALUE=URI;TYPE=JPEG:https://johndoe.com/path/to/jpeg/image.jpeg
TEL;TYPE=MOBILE:+1 781 555 1212
EMAIL:me@johndoe.com
URL:https://johndoe.com
REV:2017-29-01T13:52:43Z
BDAY:19880310
ADR;TYPE=WORK,PREF:;;2 Some Avenue;Anytown;SF;11111;USA
END:VCARD}};
{{< /highlight >}}

<div class="row">
  <div class="eight columns">
<p>The above code illustrated a basic vCard. If you want the QR-code to be less dense, remove the data or change the QR-code level. This level controls the amount of redundancy in the QR-code. `L`, `M`, `Q` and `H` are the different levels from lowest to highest redundancy. Here we've chosen for the default `M`-level since that's a good trade off between data density and redundancy. The meaning of the different vCard properties is {{< blank_url "well explained on Wikipedia" "https://en.wikipedia.org/wiki/VCard#Properties" >}}.</p>

<p>Once all the code is added and compiled at least twice (on the first run it is possible not everything is positioned correctly), this should be the final result.</p>
  </div>
  <div class="four columns">
    {{< fig file="business-card-back" alt="business card back" imgClass="frame" class="centre-element max-300px-wide" id="business-card-back" >}}
  </div>
</div>

## Final Result

<div class="row">
  <div class="four columns">
    {{< fig file="business-card-front" alt="business card front" imgClass="frame" class="centre-element max-300px-wide" id="business-card-front-result" >}}
  </div>
  <div class="four columns">
    {{< fig file="business-card-back" alt="business card back" imgClass="frame" class="centre-element max-300px-wide" id="business-card-back-result" >}}
  </div>
  <div class="four columns">
<p>This is what the final card looks like. It's pretty simple code and results in a nice looking business card in my opinion. You can download the full code from the {{< blank_url "GitHub repo" "https://github.com/opieters/business-card" >}}.</p>
  </div>
</div>
