---
layout: post
title: "Designing a Curriculum Vitæ in LaTeX – Part 2: Sidebar Design" 
tags: [limecv, curriculum vitae, LaTeX, TikZ]
date:     "2017-10-02T18:53:00+02:00"
slug: "designing-a-cv-in-latex-part-2"
---

This is the second blog post in a four part series on the design of the `limecv` document class. In this second blog post, we will design the sidebar. This bar will contain the basic information such as your name, position, contact details and language skills. This will be the simpler part of the document to design, so it's a good start. First, we will draw the background and then go over each of the sections separately.

<!--more-->

The previous article:

* _Designing a Curriculum Vitæ in LaTeX – Part 1: Concept and General Design_ which can be found [here]({{< relref "designing-a-cv-in-latex-part-1/index.md" >}}).

## The Light Green Background

As depicted in the [layout image]({{< ref "/blog/designing-a-cv-in-latex-part-1/index.md#cv-margins" >}}), we will add a light green sidebar to the left. To this end, we will make use of a `tikzpicture`. First, we must load the TikZ package and some of its libraries using the following piece of code in the preamble:

{{< highlight latex >}}
\usepackage{tikz}
\usetikzlibrary{calc,positioning,backgrounds,matrix}
{{< /highlight >}}

Not all libraries are needed for now, but we will load libraries that come in handy later already. The `calc` library allows to use complex node combinations (e.g. fractions of node coordinates), while the `positioning` library allows convenient relative positioning of nodes (e.g. `right=1cm of title`). The background libraries allows us to use the predefined nodes such as `current page` to provide absolute positioning on the page. This is very useful to draw the sidebar background. The `matrix` library enables to conveniently place regular table-like node combinations without needed to code all relative distances separately. 

We can now draw the green background rectangle using the following piece of code:

{{< highlight latex >}}
\begin{tikzpicture}[remember picture,overlay]
  \fill[cvGreenLight] (current page.north west) 
    rectangle ++(\cvSideWidth+2\cvMargin,-\paperheight);
\end{tikzpicture}
{{< /highlight >}}

The code itself is very straightforward. The options are `remember picture` and `overlay`. `remember picture` saves of the current picture on the page to an auxiliary file such that it can be used in the calculation of its placement during the next compilation and . When `overlay` is turned on, everything within the current TikZ scope is not taken into consideration when calculating the bounding box of the current picture. The combination of both options allows to place shapes and text arbitrarily around the page.

Next, we draw the actual rectangle using the `\fill` macro, which will automatically fill the entire shape with the specified colour (`cvGreenLight`). The shape we're using is a rectangle (obviously) drawn for the upper left corner to the lower right corner with the specified width and height. The `++()` syntax uses relative positioning from the previous node (`(current page.north west)`).

We still need to define our colours, to this end, we need to add the following code to the preamble:

{{< highlight latex >}}
% define four main colours
\definecolor{cvGreen}{HTML}{357F2D}
\definecolor{cvGreenLight}{HTML}{B8E4B3}
\definecolor{cvDark}{HTML}{2F3142}
{{< /highlight >}}

These commands define new colours using RGB hex values. For print, CMYK might be more appropriate, but here we'll mainly focus on digital viewing, since most CVs are sent electronically. 

The sidebar needs to be centred both horizontally and vertically. We are going to typeset the sidebar directly and not inside a huge `tikzpicture`. This makes the code a little easier to maintain and write. To make everything easily centred, we are going to wrap everything inside a `minipage` which is centred by means of the following code: 

The code looks like this:

{{< highlight latex >}}
\vspace*{\fill}
\begin{minipage}{\cvSideWidth}
  \begin{center}
    % contents
  \end{center}
\end{minipage}
\vspace*{\fill}
{{< /highlight >}}

Notice that this code will centre the contents horizontally (`center` environment) and vertically (by means of `\vspace*{\fill}`). Typesetting the sidebar in this way is very convenient for normal text since it will flow as if it were typed onto a page with this width. 

## The ID Section 

The most important information in the entire CV is of course you name and contact information. Otherwise people receiving it won't be able to contact you. I also find it useful to include a picture in the CV, since this makes things a bit more personal.

For the image, we are going to crop it such that it has a round shape with the name typeset below. The following code provides such facilities (based on [this code](https://tex.stackexchange.com/questions/193555/crop-jpeg-into-circular-tikz-node)):

{{< highlight latex >}}
\begin{tikzpicture}
  \node[
    circle,
    minimum size=\cvPictureWidth,
    path picture={
      \node at (path picture bounding box.center){
      \includegraphics[width=\cvPictureWidth]{images/profile_picture}
      };
    }]
    {};
\end{tikzpicture}
{{< /highlight >}}

Again, we make use of TikZ. We draw a circular node with a diameter of `\cvPictureWidth` and fill it with the picture using the `path picture` key. `path picture` allows to add a clipped shape, which is exactly what we need in this case.

We also need to define the diameter of the image using the following piece of code:

{{< highlight latex >}}
\newlength\cvPictureWidth
\setlength\cvPictureWidth{4cm}
{{< /highlight >}}

After the picture, we need to add our name and profession. We'll do this by simply typing these into the `minipage` environment. We will create several local scopes (using `{<code>}`) to vary the text colour and size using `\LARGE` and `\color` macros.

{{< highlight latex >}}
{\LARGE
John

\vspace{0.1cm}

Doe}

\vspace{0.5cm}

{\color{cvAccent} Profession}

\vspace{0.5cm}
{{< /highlight >}}

Now, we will start adding the individual sections. After some iterations, I found that the styling from the image on the left works best. 

To produce this code, we need to add smoe new macro definitions to the preamble to define the horizontal line from edge to edge and the section macro. This can be done by means of the following piece of code (based on [this](https://tex.stackexchange.com/questions/15119) and [this code](https://tex.stackexchange.com/questions/65731)): following code works best for this purpose:

{{< highlight latex >}}
\makeatletter
\def\cv@hrulefill{{\color{cvGreen}\leavevmode\leaders\hrule height 1pt\hfill\kern\z@}}

% line before and after text
\NewDocumentCommand{\ruleline}{m}{\par\noindent\raisebox{\baselineskip/4}{\makebox[\linewidth]{\cv@hrulefill\hspace{1ex}\raisebox{-\baselineskip/4}{#1}\hspace{1ex}\cv@hrulefill}}}
\makeatother
{{< /highlight >}}

First, we make the at (`@`) a regular character between the `\makeatletter` and `\makeatother` macros. This is useful to define internal commands that should not be used directly by the end user (generally, it's also applied in lots of LaTeX hacks). Then we define the `\cv@hrulefill` macro which creates a horizontal rule with the desired colour (`cvGreen`) and thickness `1pt` (here). `\leavevmode` makes sure that the vertical mode is ended and horizontal mode is entered. More info on horizontal and vertical modes can be found [here](http://www.tug.org/TUGboat/Articles/tb12-2/tb32eijkhout-structure.pdf).

Now, we define the section macro as `\ruleline`, which takes one mandatory argument (indicated by `m`). The command itself start with defines a new paragraph, draws the horizontal lines to the left and right and adds the section title in between.

We can proceed to define out first section, the profile section:

{{< highlight latex >}}
\ruleline{Profile}
  
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dictum imperdiet orci, at placerat nulla sagittis id. Praesent iaculis iaculis lorem a aliquam. Nam non fringilla sapien, quis posuere lectus. Quisque ac rhoncus massa. Vestibulum blandit ullamcorper nulla at posuere. In consectetur tempor sem, in interdum mi tempus nec. Cras.

\vspace{4pt}
{{< /highlight >}}

This is an intro for your cv, which describes your career, background and future plans. Be sure to make it concise, to the point and positive. (Side note: the `\vspace` is there to add some additional space to separate the sections by more than the default line spacing.)

## The Contact Section

Let's continue with a more challenging section, the contact section. For this, we'll essentially re-use the structure [from the business card design]({{< ref "/blog/designing-a-business-card-in-latex/index.md" >}}). First, we indicate that this is the contact section by means of `\ruleline{Contact}`, add some space between the title and the `tikzpicture` and then add all contact information. The structure is nearly identical to the business card with two columns: one for the icons and another one for the text. There are some additional icons present, since we have way more space available. 

{{< highlight latex >}}
\ruleline{Contact}

\vspace{4pt}

\begin{tikzpicture}[every node/.style={inner sep=0pt, outer sep=0pt}]
  \matrix [
    column 1/.style={anchor=center,contactIcon},
    column 2/.style={anchor=west,align=left,contactText},
    column sep=5pt,
    row sep=5pt] (contact) {
    \node{\faMapMarker}; 
      & \node{Some Street 5\\B-9000 Ghent\\Belgium};\\
    \node{\faEnvelope}; 
      & \node{\href{mailto:me@johndoe.com}{me@johndoe.com}};\\
    \node{\faPhone}; 
      & \node[contactText]{+1 781 555 1212};\\
    \node{\faGlobe}; 
      & \node{\href{https://johndoe.com}{johndoe.com}};\\
    \node{\faGithub}; 
      & \node{\href{https://github.com/johndoe}{johndoe}};\\
    \node{\faLinkedinSquare}; 
      & \node{\href{https://www.linkedin.com/in/johndoe/}{johndoe}};\\
    \node{\faTwitter}; 
      & \node{\href{https://twitter.com/JohnDoe}{@JohnDoe}};\\
    \node{\faKey}; 
      & \node{\href{https://keybase.io/johndoe}{\texttt{EA31 B617 B3A1 EFF0}}};\\
};
\end{tikzpicture}

\vspace{4pt}
{{< /highlight >}}

To make the above code work, we need to load the `fontawesome` and `fontspec` packages:

{{< highlight latex >}}
% load external fonts
\usepackage{fontspec}    

% icon font
\usepackage{fontawesome}  
{{< /highlight >}}

Since we're discussing fonts, now is also a good time to set the main font. We'll use the same Fira Sans font as in the business card, so we need to add the following code after loading the `fontspec` package:

{{< highlight latex >}}
% load external fonts
\setmainfont[Numbers={OldStyle,Monospaced}]{Fira Sans}
\setsansfont{Fira Sans}
\setmonofont{Fira Mono}
{{< /highlight >}}

Note that we have also defined two new TikZ styles, this makes it much easier to make tiny tweaks without having to worry about copying code everywhere.

The definiton of these is included below (and should be included in the preamble):

{{< highlight latex >}}
\tikzset{
  contactIcon/.style={%
    minimum height=\baselineskip,
  },
  contactText/.style={%
    minimum height=\baselineskip,
    text depth=0pt,
  }
}
{{< /highlight >}}

This concludes the contact section. Our final section in the sidebar is the languages section, which we'll discuss next.

## The Languages Section

The languages section code looks very similar to that of the contact section. I've opted to use a TikZ picture, but a table is a good alternative to obtain the same structure. However, since I wanted reall progress bars, it's more convenient to use one "big" tikzpicture than several small ones for the progress bars. 

Initially, I wanted to use country flags to indicate the languages, but in the end dropped this for two reasons. Firstly, adding colours to unicode is not easy since its not really part of the standard and different systems use different display styles and secondly, usually languages are spoken natively in multiple countries. To make things more uniform, I opted to use the name instead. 

{{< highlight latex >}}
\ruleline{Languages}

\vspace{4pt}

\begin{tikzpicture}[every node/.style={text depth=0pt,inner sep=0pt,outer sep=0pt}]
  \matrix [
    column 1/.style={anchor=east,languageText},
    column 2/.style={anchor=west,align=left,progressArea},
    column sep=6pt,
    row sep=6pt,
    ] (contact) {
    \node{English}; & \node (language 1) {}; \\
    \node{German};  & \node (language 2) {}; \\
    \node{Spanish}; & \node (language 3) {}; \\
  };
  \draw (language 1.west) node[progressBar,minimum width=5/5*\cvLanguageBarWidth] {};
  \draw (language 2.west) node[progressBar,minimum width=3/5*\cvLanguageBarWidth] {};
  \draw (language 3.west) node[progressBar,minimum width=3/5*\cvLanguageBarWidth] {};
\end{tikzpicture}
{{< /highlight >}}

Drawing progress bars does require a bit more effors than using one single matrix node. First, we draw the languages and the empty progress bars. All of these bars have the same properties, defined in `progressArea`. Note that we label each of the progress bars with a unique label.

The progress bar node labels are then used to draw the fill. The respective styles and widths are defined below.

{{< highlight latex >}}
\newlength\cvLanguageBarWidth
\setlength\cvLanguageBarWidth{5em}

\tikzset{
  % previous TikZ styles
  languageText/.style={},
  progressArea/.style={%
    minimum width=\cvLanguageBarWidth,
    minimum height=\cvLanguageBarHeight,
    rectangle,
    draw,
    cvGreen},
  progressBar/.style={%
    minimum height=\cvLanguageBarHeight,
    rectangle,
    draw,
    fill,
    cvGreen,
    anchor=west},
}
{{< /highlight >}}

This concludes the sidebar. The complete code for the sidebar we've created here, can be [found on GitHub](https://github.com/opieters/limecv_design/blob/master/src/part-2-sidebar/limecv_sidebar.tex).

{{< fig file="limecv-sidebar.svg" id="cv-sidebar" class="centre-element max-500px-wide" alt="CV sidebar design" imgClass="frame" >}}
