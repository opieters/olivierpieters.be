---
title:  "A Basic LaTeX Preamble"
date:   "2016-08-10T07:23:00+02:00"
draft:   false
update: "2016-08-14T15:07:00+02:00"
tags:   [LaTeX, preamble]
category: LaTeX
slug: latex-preamble
---

The preamble is the place where one lays a document's fundaments. It is used to include additional packages, set options, define new macros (commands), add PDF information and more. Even though one can define commands and set certain options within the document, it is preferred to set options globally. Otherwise we start smearing these definitions over the entire document, which makes finding things harder. This makes setting up the preamble a vital part of every document that is often overlooked.
<!--more-->

In addition to adding more structure to the document, sometimes unexpected behaviour occurs when things are not done in the correct order. Writing a preamble is not very hard for simple documents, but for larger documents (i.e. package heavy documents), complications can occur.

## Getting Started: Absolute Basics

### Specifying the Compiler

Most (La)TeX documents have the `.tex` extension. This makes it hard to differentiate between different compilation engines because there is no such thing as a makefile for regular projects (TeX makefiles do exist, but they mainly serve the package writers, not document writers). Thus we will need some other way to define the compiler and encoding of the document. This is something that is editor dependent, but most editors will recognize the TeXShop way of doing this:

{{< highlight latex >}}
% !TEX TS-program = xelatex
% !TEX encoding = UTF-8 Unicode
{{< /highlight >}}

In this example, the XeLaTeX compiler is used with a unicode encoding. This way, our editor will know it needs to use the XeLaTeX compiler, and not the default compiler (`pdflatex` on most systems). If we compile using the command line, these two lines will just be ignored. More info about options that can be set this way can be found {{< blank_url "here" "http://tex.stackexchange.com/questions/78101/when-and-why-should-i-use-tex-ts-program-and-tex-encoding" >}}.

### Defining the Document Class and Adding Packages

After setting these compiler options, we need to define the type of document (typically `book`, `report` or `article`) and some additional information about the document and language. It is important to set the language in the `\documentclass` command to make sure all packages use the correct language.

It is typically a good idea to try and make groups of packages (e.g. general, scientific, plotting). This will once again create more structure in this (plaintext) document. This is of course not required for the compiler to work properly, but makes finding things a lot easier. Now we can really start including packages, setting options, defining commands etc.

Setting big global options such as page margins is best done after loading the packages. However, sometimes we need to define some of these options before we can include subsequent packages. This is for instance needed when using `\numberwithin`. This needs to be set before loading the `hyperref` package. Otherwise, unexpected results might occur.

An extremely basic example is:

{{< highlight latex >}}
% !TEX TS-program = xelatex
% !TEX encoding = UTF-8 Unicode

\documentclass[11pt,a4paper,english]{article} % document type and language

\usepackage{babel}   % multi-language support
\usepackage{float}   % floats
\usepackage{url}     % urls
{{< /highlight >}}

The more packages we include, the slower compilation will become. However, for most documents (especially those including TikZ figures), the time spent to process the preamble will remain less than the actual document, but it is good to keep the number of packages to a minimum, especially during production.

### The Actual Document

After finishing the preamble, the actual document follows. Open the `document` environment, add everything and finally close the document. Commands that are present after finishing the document will not be executed, so they will not have any effect on the PDF that is produced.

For our example the final result is:

{{< highlight latex >}}
% !TEX TS-program = xelatex
% !TEX encoding = UTF-8 Unicode

\documentclass[11pt,a4paper,english]{article} % document type and language

\usepackage{babel}   % multi-language support
\usepackage{float}   % floats
\usepackage{url}     % urls

\begin{document}

% document contents

\end{document}

% redundant stuff

% example (will not result in compilation error because this is not exectured
%   even though this command is not defined):
\oneAwesomeCommand
{{< /highlight >}}

## More Elaborate Example and Useful Packages

### General and Layout Oriented Packages

I usually load a set of about 30 packages in all basic documents. These provide most of the basic functionality expected in modern LaTeX documents and some room for customisation of the layout.

A good set of general packages is the following:

{{< highlight latex >}}
\usepackage[l2tabu,orthodox]{nag}  % force newer (and safer) LaTeX commands
\usepackage[utf8]{inputenc}        % set character set to support some UTF-8
                                   %   (unicode). Do NOT use this with
                                   %   XeTeX/LuaTeX!
\usepackage{babel}                 % multi-language support
\usepackage{sectsty}               % allow redefinition of section command formatting
\usepackage{tabularx}              % more table options
\usepackage{titling}               % allow redefinition of title formatting
\usepackage{imakeidx}              % create and index of words
\usepackage{xcolor}                % more colour options
\usepackage{enumitem}              % more list formatting options
\usepackage{tocloft}               % redefine table of contents, new list like objects
{{< /highlight >}}

I do need to mention that the `inputenc` package is a rather dirty hack that tries to add some unicode support. By including this package you can type the umlaut as you do in regular WYSIWYG editors (opposed to typing `\"o` for `ö`). Do not expect that it will allow you to type Korean in your text.

By default, LaTeX's column widths are calculated to make them just wide enough for the contents. However, sometimes we have multiline cells or want to have equal cell width. This is possible when using these extra column definitions:

{{< highlight latex >}}
% define tables with fixed column width
\newcolumntype{L}[1]{>{\raggedright\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{C}[1]{>{\centering\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{R}[1]{>{\raggedleft\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
{{< /highlight >}}

More information can be found in my [tables in LaTeX post]({{< ref "/blog/tables-in-latex.md">}}).

#### Whitespace and Margins

The default margins and paragraph spacing is OK, but I find the text width to be rather small by default. The paragraph indent is also something that is not really needed. To fix this, we can use the `geometry` package. It provides several useful options that allow to change the margins (widths and other whitespace distances) quite easily:

{{< highlight latex >}}
\usepackage[centering,noheadfoot,margin=1in]{geometry}
\setlength{\parindent}{0cm}
\setlength{\parskip}{2ex plus 0.5ex minus 0.2ex} % whitespace between paragraphs

% set TOC margins
\setlength{\cftbeforesecskip}{15pt} % skip in TOC
% also possible (incl. variants): \setlength{\cftbeforechapskip}{10pt}
{{< /highlight >}}

Remember the `a4paper` option we set in `\documentclass`? This is passed by this command to the `geometry` package to set appropriate parameters. Additionally, we centre the text, remove space reserved for header and footer and set all margins to 1 inch.

Paragraph whitespace cannot be set this way. We need to define the lengths ourselves (the two successive `\setlength` commands). We can also change the whitespace in the table of contents, as is illustrated above.

In place of using `\setlength` to redefine paragraphy whitespace, we can also just include the `parskip` package:

{{< highlight latex >}}
\usepackage{parskip}
{{< /highlight >}}

This will effectively remove all paragraph whitespace, and in addition also modify space between list items.

Two final remarks: avoid using the `fullpage` package (use the `geometry` package instead) and if we use (more) modern document classes (i.e. KOMA-Script classes or `memoir`), we should set the paragraph indentetion and skip using their respective options.

#### Title Layout

The default layout for `\maketitle` is also fine, but I prefer the title, author and date to stand out a little more. One way to do this, is by changing the font and font size using the following set of commands:

{{< highlight latex >}}
% redefine \maketitle command with nicer formatting
\pretitle{
  \begin{flushright}         % align text to right
    \fontsize{40}{60}        % set font size and whitespace
    \usefont{OT1}{phv}{b}{n} % change the font to bold (b), normally shaped (n)
                             %   Helvetica (phv)
    \selectfont              % force LaTeX to search for metric in its mapping
                             %   corresponding to the above font size definition
}
\posttitle{
  \par                       % end paragraph
  \end{flushright}           % end right align
  \vskip 0.5em               % add vertical spacing of 0.5em
}
\preauthor{
  \begin{flushright}
    \large                   % font size
    \lineskip 0.5em          % inter line spacing
    \usefont{OT1}{phv}{m}{n}
}
\postauthor{
  \par
  \end{flushright}
}
\predate{
  \begin{flushright}
  \large
  \lineskip 0.5em
  \usefont{OT1}{phv}{m}{n}
}
\postdate{
  \par
  \end{flushright}
}
{{< /highlight >}}

Something strange happens here: sometimes we open an environment, but don't close it and vice versa. This is intended because of the call order. Before typesetting the title, the commands in `\pretitle` are executed. Then, the title is inserted and finally the commands in `\posttitle` are executed. As a consequence we open and close the environments in the correct way.

Because TeX was designed before standard font encodings such as OpenType were invented, it has a rather special way of defining font sizes. What we do, is set the size we want with `\fontsize` and then make LaTeX search for the size in its mapping that is closest to the desired value with `\selectfont`. We can also specify text size using default LaTeX macros that do not require `\selectfont` because they use a value that is defined in the mapping. `\large` is one of them. A complete list is provided on {{< blank_url "Wikipedia" "https://en.wikibooks.org/wiki/LaTeX/Fonts#Sizing_text" >}}.

The font encoding is also a bit different depending on our needs. If we only use plain English (i.e. no letters with accents) then the default `OT1` encoding will suffice. It provides (approximately) all characters in the ASCII table. However, if additional characters are needed, switching to `T1` might be useful (just replace `OT1` with `T1` in the above commands). If we need to typeset non-western characters (read: languages such as Greek, Chinese and Arabic), we should use XeTeX (with a font that supports the target language). A list of available fonts (for LaTeX users) that are installed by default can be found {{< blank_url "font list" "https://en.wikibooks.org/wiki/LaTeX/Fonts#Available_LaTeX_Fonts_.5B2.5D" >}}.

If we want an entire page for the title, author, date... We can of course use the `titlepage` environment in out document:

{{< highlight latex >}}
% preamble

\begin{document}
  \begin{titlepage}
    % define an awesome layout
  \end{titlepage}
\end{document}
{{< /highlight >}}

### Using a Different Font

In the previous section, we changed the font of the title, author and date. Let's go a bit further and change the font of the entire document. In LaTeX, using system fonts is not possible, but we can always load additional fonts by including packages. For example:

{{< highlight latex >}}
\usepackage{lmodern}                % load latin modern fonts
\usepackage[defaultsans]{cantarell} % cantarell fonts
{{< /highlight >}}

After loading the appropriate package, we need to redefine the font family. To use Latin Modern, we need to execute:

{{< highlight latex >}}
% set LaTeX global font
\renewcommand{\familydefault}{\sfdefault}
\renewcommand{\sfdefault}{lmss}
{{< /highlight >}}

If we want to apply styling to the headings, this is done using:

{{< highlight latex >}}
% set styling headings
\allsectionsfont{\usefont{OT1}{phv}{b}{n}}
{{< /highlight >}}

Changing the math font in LaTeX is not very easy, and might need a lot of command redefinitions, so we will skip this. If we want to have more font control, we should really use Xe(La)TeX.

Xe(La)TeX users can use system fonts, providing users with a much bigger font library at their fingertips! Before loading these fonts, the `fontspec` package needs to be included:

{{< highlight latex >}}
\usepackage{fontspec}               % fonts for XeLaTeX
{{< /highlight >}}

After loading this package, we can use commands such as `\setmainfont` to load a specific system font. To redefine the main and mono spaced fonts for example, we can use:

{{< highlight latex >}}
\setmainfont{Arial}
\setmonofont{Inconsolata}
{{< /highlight >}}

If we want to redefine the math font, we should load the `mathspec` package in place of the `fontspec` package. However, most fonts do not have a complete math table (read: not all symbols are defined). If a symbol is not defined in the selected font, it will fall back to Computer Modern (LaTeX default).

If full font consistency is required, we can load the `unicode-math` package. This will only work with fonts that have a complete math table. An list can be {{< blank_url "found on tex.stackexchange" "ttp://tex.stackexchange.com/questions/96024/how-to-use-system-font-for-equation-in-xelatex" >}}.

### Scientific Packages

LaTeX is very well suited for mathematics and science in general, having packages for advanced mathematics, chemical formulas and more. The list below is a must-have addition to the built-in possibilities:

{{< highlight latex >}}
\usepackage{amsmath}                                    % extensive math options
\usepackage{amssymb}                                    % special math symbols
\usepackage[Gray,squaren,thinqspace,thinspace]{SIunits} % elegant units
\usepackage{listings}                                   % source code
{{< /highlight >}}

Only the first two packages are really required for most users. However, if we need monospaced text (read: computer code), `listings` is a very good package. `minted` is a good alternative, but requires Python to be installed for syntax highlighting. `SIunits` provides the `\unit` command, which adds a thin space between the value and unit. Some examples:

{{< highlight latex >}}
\unit{10}{\newton}
\unit{0.5}{\nano\squaremetre}
\unit{10}{\deci\bel}
{{< /highlight >}}

Almost all units are predefined as LaTeX commands. The `squaren` option is the only required one for compatibility with `amsmath`.

One might expect an absolute value command to be defined by `amsmath`, but it is not. The list below tries to define several missing commands and make things easier to read. Usage of `\left` and `\right` is needed to make brackets scale according to their contents. The final command forces fractions and integrals within fractions to have a normal size. By default, LaTeX will scale them down, but this often leads to less beautiful math expressions in my opinion.

{{< highlight latex >}}
% missing math commands
\providecommand{\abs}[1]{\left\lvert#1\right\rvert}                    % |.|
\providecommand{\br}[1]{\left(#1\right)}                               % (.)
\providecommand{\sbr}[1]{\left[#1\right]}                              % [.]
\providecommand{\ddfrac}[2]{\frac{\displaystyle #1}{\displaystyle #2}}
% use \mathrm{d} to include math differential
{{< /highlight >}}

If the `listings` package is loaded, we need to activate these options to have monospaced code, avoid hbox overflows and more. The options are quite straightforward. More information can be found in the [tips and tricks post]({{< ref "/blog/latex-tips-and-tricks.md" >}}).

{{< highlight latex >}}
% options for listings
\lstset{
  breaklines=true,
  postbreak=\raisebox{0ex}[0ex][0ex]{\ensuremath{\color{red}\hookrightarrow\space}},
  numbers=left,
  numbersep=5pt,
  numberstyle=\tiny\color{gray},
  basicstyle=\footnotesize\ttfamily
}
{{< /highlight >}}

### Referencing, Annotating and Citing

One of the great powers of LaTeX is its referencing system. The default combination of `\label` and `\ref` works very well, but it could benefit from a few additions.

If we want to have numbering within each section for example, we need to use `\numberwithin`. We specify the numbered environment followed by the heading in which the counter will be reset. This can be useful for lengthy articles.

{{< highlight latex >}}
% NEEDS to be before hyperref, cleveref and autonum
% number figures, tables and equations within the sections
\numberwithin{equation}{section}
\numberwithin{figure}{section}
\numberwithin{table}{section}
{{< /highlight >}}

Let's get to the actual packages. A good default list for annotating and referencing is the following:

{{< highlight latex >}}
% references and annotation, citations
\usepackage[small,bf,hang]{caption}        % captions
\usepackage{subcaption}                    % adds subfigure & subcaption
\usepackage{sidecap}                       % adds side captions
\usepackage{hyperref}                      % add hyperlinks to references
\usepackage[noabbrev,nameinlink]{cleveref} % better references than default \ref
\usepackage{autonum}                       % only number referenced equations
\usepackage{url}                           % urls
\usepackage{cite}                          % well formed numeric citations
{{< /highlight >}}

More information about usage and what each individual package does, can be found in the [references in LaTeX post]({{< ref  "/blog/references-in-latex.md" >}}).

We can also add some custom colours to hyperlinks with the following code:

{{< highlight latex >}}
% format hyperlinks
\colorlet{linkcolour}{black}
\colorlet{urlcolour}{blue}
\hypersetup{colorlinks=true,
            linkcolor=linkcolour,
            citecolor=linkcolour,
            urlcolor=urlcolour}
{{< /highlight >}}

Adding a bibliography is usually done with `bibtex`. There also is the default `thebibliography` environment, but it is not very flexible. More about adding a bibliography and `bibtex` in a future blog post.

### Drawing and Plotting

LaTeX is not only good for mathematics, there are also very powerful drawing libraries available in LaTeX documents. My personal favourite is TikZ. Packages such as `pgfplots` build on TikZ to add even more functionality to the already huge TikZ framework. A possible list of packages:

{{< highlight latex >}}
\usepackage{tikz}          % advanced vector graphics
\usepackage{pgfplots}      % data plotting
\usepackage{pgfplotstable} % table plotting
\usepackage{placeins}      % display floats in correct sections
\usepackage{graphicx}      % include external graphics
\usepackage{longtable}     % process long tables

% use most recent version of pgfplots
\pgfplotsset{compat=newest}
{{< /highlight >}}

More information on usage of these packages can be found in the [creating Tikz figures]({{< ref "/blog/a-short-introduction-to-creating-tikz-figures/index.md" >}}) and [tables in LaTeX]({{< ref "/blog/tables-in-latex.md" >}}) posts.

### Misc: Todo Notes, EPS Support, Floats, Headers...

If we want to add things such as TODO notes, EPS support (there is none by default!), floats (images, tables...) and a header/footer, these are the go-to packages:

{{< highlight latex >}}
\usepackage{todonotes} % add to do notes
\usepackage{epstopdf}  % process eps-images
\usepackage{float}     % floats
\usepackage{fancyhdr}  % header and footer
{{< /highlight >}}

After these packages, it might be useful to add the definitions for new macros. Defining new macros is every useful if we need to repeat certian aspects of the document, without needing to copy and past everything. More on this in a future blog post.

More often than not, we need to include figures in our documents. These are usually located in a subdirectory of our LaTeX project. Specifying this directory every time when inserting a figure is cumbersome. We can predefine where LaTeX needs to look using this command:

{{< highlight latex >}}
% default path for figures
\graphicspath{{figures/}}
{{< /highlight >}}

If we have multiple directories, specify them like this: `\graphicspath{{figures_ch1/}{figures_ch2/}}`. Notice the use of `{}`. No spaces are allowed and values are _not_ separated with commas.

To conclude this section, we will add a header and footer (we loaded the `fancyhdr` package, so let's use it). LaTeX has a set of predefined header/footer styles: `plain` (only page number), `empty`, `headings` (depends on document style, usually includes additional info on where we are in the document) and `myheadings` (page number top left/right, the rest can be modified using `\markright` and `\markboth`).

However, using the default options can be limiting, that's why we loaded the `fancyhdr` package. It provides flexibility and is easy to use. First, set the page style to `fancy`. Then, we usually clear all header and footer fields (this is good practice). Now we can define what is contained in the header or footer of our page using `\rhead`, `\chead`, `\lhead`, `\rfoot`, `\cfoot` and `\lfoot`. The example below adds the page number in the centre of the footer, not very creative, but it is illustrative though. Notice we also redefined the `\headrulewidth`, which cases a horizontal line to be inserted after the header.

{{< highlight latex >}}
% set header and footer
\pagestyle{fancy}
\fancyhf{}                           % clear all header and footer fields
\cfoot{\thepage}                     % add page number
\renewcommand{\headrulewidth}{0.4pt} % add horizontal line of 0.4pt thick
{{< /highlight >}}

If we need to specify left and right pages for two-sided printing (default in the book document class), we should use the `fancyhead` and `fancyfoot` commands. More information is provided in the {{% blank_url "`fancyhdr` documentation" "http://mirrors.ctan.org/macros/latex/contrib/fancyhdr/fancyhdr.pdf" %}}.

## Some Side Notes

Some packages need to be loaded in a specific order. A common example is the following set: `hyperref`, `cleveref` and `autonum`. These need to be loaded in that exact order, otherwise very ugly things can occur. We also need to set how references are created and stored _before_ we can load these packages (hence the `\numberwithin` commands need to be executed before the above set can be loaded).

One package that deserves a special mention is `nag`. `nag` is only used to force the usage of newer commands and to output some warnings if we do not add a caption and label to a float. It is essential in contemporary texts to reference a float, otherwise it adds no meaning to the text and thus is useless.

If we are compiling a larger document, we may want to add the `draft` option to the `\documentclass` command. This speeds up compilation by not including external sources (such as images). And is very useful if we are looking for syntax errors or just compiling an unfinished document.

## Conclusion

Writing a LaTeX preamble is not the easiest nor the hardest thing about LaTeX. Writing a good preamble for most documents takes some time. However, it is well worth it since we can avoid common mistakes and pitfalls.

