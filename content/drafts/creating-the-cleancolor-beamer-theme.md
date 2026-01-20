---
layout: post
title:  "Creating the Cleancolor Beamer Theme"
tags:   [LaTeX, Beamer, cleancolor]
draft: true
---

This page describes how the template was built. If you only want to use the template for your own Beamer presentation, take a look at the GitHub (latest stable version) or BitBucket (bleeding edge, possibly unstable) page.

Here, we will describe how the cleancolor beamer template (version 1.0) is constructed from scratch. The construction is based on a great StackExchange answer, found [here](http://tex.stackexchange.com/questions/146529/design-a-custom-beamer-theme-from-scratch). The design is based on a PowerPoint template I created a while ago (found <a href="">here</a>), and acts as a reference design throughout the process of designing the beamer template.

The beamer template we will design is _not_ a set of changes to the default beamer class, as some people do, but a real beamer template. As a consequence, it is composed of several files. These files define different aspects of the presentation as described in the beamer manual. We will go though the template definition step by step, jumping though the different files.

First, we need to define the class file, this is the file that holds everything together and will be loaded from your `.tex` source file. Because we will name our template cleancolor. This is US spelling, a UK version would be cleancolor. We will use US spelling here, because it is kind of standard to use US spelling in code. The class file gets the name `beamerthemecleancolor.sty` (`.sty` denotes that this is a LaTeX class file).

## Defining the Basis of the Main Theme File

To start, we will only include the themes we will write (if a theme is not specified, the default theme applies). We also remove all navigation symbols since we want to have a minimal amount of clutter on our slides and define blocks aspects. At the top we state that the TikZ packages is needed. To see why, see below.

{{< highlight latex >}}
\mode<presentation>
%%%%%%%%%%%%%%%%%%%%%
% required packages %
%%%%%%%%%%%%%%%%%%%%%
\RequirePackage{tikz}

%%%%%%%%%%%%%%%%%%
% theme settings %
%%%%%%%%%%%%%%%%%%
\useinnertheme{cleancolor}
\useoutertheme{cleancolor}
\usecolortheme{cleancolor}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% define global beamer values %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\setbeamertemplate{navigation symbols}{} % remove navigation symbols
\setbeamertemplate{blocks}[rounded][shadow=false] % define blocks aspects

\mode<all>
{{< /highlight >}}

Because we defined our inner, outer and color theme to be `cleancolor`, we need to use the following files: `beamerinnerthemecleancolor.sty`, `beamerouterthemecleancolor.sty` and `beamercolorthemecleancolor.sty`. We will start with the easiest file, the color theme.

## Defining the Beamer Color Theme

The color theme defines the colour of different elements in the presentation. Beamer always uses two colours for each element: a foreground and background colour. The foreground colour is usually the text colour. We only want to specify the foreground at this point and need to make everything a neutral black. This is done as follows:

{{< highlight latex >}}
\mode<presentation>

\setbeamercolor*{title}{fg=black}
\setbeamercolor*{title page header}{fg=black}
\setbeamercolor*{author}{fg=black}
\setbeamercolor*{date}{fg=black}

\setbeamercolor*{item}{fg=black}
\setbeamercolor*{frametitle}{fg=black}
\setbeamercolor*{section in toc}{fg=black}
\setbeamercolor*{subsections in toc}{fg=black}

\mode<all>
{{< /highlight >}}

This is the only change we are making to the colour theme. Now, the first (and easiest) of our four template files is done. Next up: the outer theme.

## Outlay of the Outer Theme

The outer theme defines borders, frame titles , navigation symbols and so on. We want our slides to be quite minimalistic. As a consequence, these navigation symbols were removed (see theme definition). First, we will redefine the frame title and subtitle as follows:

{{< highlight latex >}}
% define frame title
\defbeamertemplate*{frametitle}{cleancolor}[1][]
{
\vskip0.05\paperheight%
\begin{beamercolorbox}[wd=0.9\paperwidth]{frametitle}
\usebeamerfont{frametitle}\insertframetitle
\end{beamercolorbox}
\begin{beamercolorbox}[wd=0.9\paperwidth]{frametitle}
\usebeamerfont{framesubtitle}\insertframesubtitle
\end{beamercolorbox}
}
{{< /highlight >}}

Not that hard, next up is the left sidebar, we need to make sure this is empty for our coloured sidebar:

{{< highlight latex >}}
% make sure left sidebar is empty
\defbeamertemplate*{sidebar left}{cleancolor}[1][]{}
{{< /highlight >}}

Now the most difficult part: the coloursred sidebar:

{{< highlight latex >}}
% define left sidebar canvas
  \setbeamertemplate{sidebar canvas left}{
  \begin{tikzpicture}
  \useasboundingbox (0,0) rectangle(0.5,\the\paperheight);
  \fill[color=green] (0,0) rectangle (0.5,\the\paperheight);
  \end{tikzpicture}
}
{{< /highlight >}}

The above definitions is a temporary one. We will need to redefine it to make the colour changed after each section. For now, all slides will have the same left side colour. Finally, we need to set the frame margins explicitly:

{{< highlight latex >}}
% define beamer margins
\setbeamersize{text margin left=0.5cm}
\setbeamersize{sidebar width left=0.5cm}
\setbeamersize{sidebar width right=0cm}
\setbeamersize{text margin right=0.5cm}
{{< /highlight >}}

Do not forget to start the file with `\mode<presentation>` and end it with `\mode<all>`. All Beamer theme definitions require these, so we will not repeat them every time in our code fragments.

## Inside the Frame: the Inner Frame

It's time to define some of the inner working of our slides. First up is the title frame. This is usually the first slide visible for the viewer and present some important information: what is the presentation about, how is presenting, etc. The code for this slide is pretty long.

The first `\beamercolorbox` contains the title. The name we pass to the box (`title page header`) is important, since the box might need to be coloured by a colour defined in our colour theme. Inside the box, we load both colour and font of the title and finally, we insert the title with (you guessed it) `\inserttitle`.

{{< highlight latex >}}
% define title page
\defbeamertemplate*{title page}{cleancolor}[1][]{
  \vskip0.3\paperheight% add margin from top
  \begin{beamercolorbox}[wd=0.9\paperwidth,sep=8pt,#1,center]{title page header}
    \usebeamerfont{title}\usebeamercolor[fg]{title}\huge\inserttitle%
  \end{beamercolorbox}%
  \vskip0.05\paperheight% some space
  \begin{beamercolorbox}[wd=0.9\paperwidth,#1,center]{subtitle}%
    \usebeamerfont{subtitle}\usebeamercolor[fg]{subtitle}\insertsubtitle%
  \end{beamercolorbox}
  \vskip0pt plus 1filll % push next box to bottom of slide
  %box at bottom
  \begin{columns}%
    \begin{column}{0.45\paperwidth}%
      \begin{beamercolorbox}[wd=0.3\paperwidth,#1]{date}%
        \usebeamerfont{date}\insertdate%
      \end{beamercolorbox}%
    \end{column}%
    \begin{column}{0.45\paperwidth}%
      \begin{beamercolorbox}[wd=0.45\paperwidth,#1]{author}%
        \begin{flushright}%
          \usebeamerfont{author}\insertauthor%
        \end{flushright}%
      \end{beamercolorbox}%
    \end{column}%
  \end{columns}%
}
{{< /highlight >}}
