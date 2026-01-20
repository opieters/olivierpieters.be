---
title:    "LaTeX Tips and Tricks"
date:     "2015-12-18T14:34:41+01:00"
draft:    false
tags:     [SVG, LaTeX]
category: LaTeX
---

LaTeX has its own strengths, but also quirks. Typesetting what you really have in mind is not always very straightforward and requires some experience. Here are some general tips to quickly solve certain problems or make your LaTeX documents even better.
<!--more-->

## Spaces and Spacing

Not all spaces are equal in LaTeX. When writing a LaTeX document, it might be undesirable to have a line break between certain words. This can be avoided by using the tilde. A simple example would be then term 'Raspberry Pi'. We do not want 'Raspberry' and 'Pi' to be located on two different lines, so we write: `Raspberry~Pi` in our LaTeX source code.

When we wish to use abbreviations inside a document, we need to be careful with the use of the dot. LaTeX will insert a slightly larger space after a dot, indicating the beginning of a new sentence. This is undesirable with most abbreviations. We can force LaTeX to use a normal space by inserting a backslash after the dot. A simple example would be: `To separate reaction products we use physical processes, e.g.\ distillation.`.

The ellipsis is another example where a special LaTeX command is better suited than just inserting the obvious: three dots. It is generally accepted that `\ldots` is the best way of typesetting an ellipsis.

On the rare occasion that one really needs a line break at a certain position, we can use the double backslash to do this: `\\`. This will add a line break in text mode. Do note that there are several places where the double backslash has another meaning, most notably inside the `tabular` environment.

## Documentation

Instead of googling for the CTAN documentation, you can access it locally (offline) with `texdoc`. The usage is very simple:

{{< highlight shell >}}
$ texdoc tikz
$ texdoc cleveref
$ texdoc chemfig
{{< /highlight >}}

## Default Compiler

Most editors will use the `pdflatex` compiler by default. However, when you want to compile using a different compiler such as Lua(La)Tex or Xe(La)TeX, you must change the compiler settings manually. The LaTeX source code does not contain information about which compiler to use.

Several popular editors such as TeXShop and TeXWorks provide a solution. What we will do is add the following comments at the beginning of the LaTeX source file:

{{< highlight latex >}}
% !TEX TS-program = xelatex
% !TEX encoding = UTF-8 Unicode
{{< /highlight >}}

In the above example, we use the `xelatex` compiler instead of the (default) `pdflatex` compiler with unicode support (the `xelatex` compiler uses unicode by default, so this line is redundant. This is in contrast to the `pdflatex` compiler, which uses plain ASCII by default).

Adding these two lines at the top of our LaTeX source file allows to specify the compiler in every file separately without the need to change the settings of the editor. More information about other options and editor support can be found in {{< blank_url "this StackExchange post" "http://tex.stackexchange.com/questions/78101/when-and-why-should-i-use-tex-ts-program-and-tex-encoding" >}}.

## PDF Properties

The `hyperref` package provides a useful interface to set certain PDF properties.

The most simple setup would be to use `\usepackage[pdfusetitle]{hyperref}`. This derives the title and author of the document from the `\title` and `\author`. As a consequence, you _must_ define these _before_ loading the `hyperref` package. But it does not stop here, a lot more options are available:

{{< highlight latex >}}
\usepackage[pdfauthor={My Name},
            pdftitle={A Title},
            pdfsubject={A Subject},
            pdfkeywords={Some Important Keywords}]{hyperref}
{{< /highlight >}}

One could also use:

{{< highlight latex >}}
\hypersetup{pdfauthor={My Name},
            pdftitle={A Title},
            pdfsubject={A Subject},
            pdfkeywords={Some Important Keywords}}
{{< /highlight >}}

## Code Fragments

Adding monospaced text can be done with the `verbatim` environment. This is quite a simple environment and will work for simple cases. When a user wants more advanced features such as syntax highlighting, line numbers, external snippet files etc., the `listings` package is more appropriate.

After loading the package, we set some options to beautify the typesetting. We force a slightly smaller monospaced font, allow line breaks and add line numbers.

{{< highlight latex >}}
\usepackage{listings}

\lstset{basicstyle=\footnotesize\ttfamily, % font style and size
  breakatwhitespace=false,
  breaklines=true,
  numbers=left,
  numberstyle=\tiny,
  numbersep=5pt
}
{{< /highlight >}}

After setting the appropriate options, we can start adding inline and block code. Inline code is done with `\lstinline`. The environment is `lstlisting`. Both are illustrated in the example below.

{{< highlight latex >}}
\begin{lstlisting}[language=matlab]
clear; close all;

data = [0 1 0 0 1 0 1 1 0 1 0 0 0 0 0];

% [...] map data etc.

x = cos(2*pi*(f./Fs).*t)*10;

% create spectrogram
%  window has size of data length /2
%  window/2 overlap between subsequent windows
%  default fft points
%  sample frequency Fs
[s,f,t]=spectrogram(x,D/2,D/4,[],Fs);
\end{lstlisting}

The above code uses an FSK~constellation to transmit symbols from the
transmitter to the receiver. Demodulation is done through a short term Fourier
transform of the received signal (\lstinline[language=matlab]|spectrogram|).
{{< /highlight >}}

We can also include entire files. This way, we do not have to copy any code into our LaTeX source code and keep the document cleaner. The `parallel.vhd` file is include with this snippet:

{{< highlight latex >}}
\lstinputlisting[language=bash]{code/parallel.vhd}
{{< /highlight >}}

Another package worth mentioning is `minted`. `minted` provides better syntax highlighting, but requires an external highlighter: pygments. Using this package requires the `--shell-escape` option to be enabled during compilation.

## Line Breaks Inside TikZ Node Labels

Adding a line break inside a label node is not possible without the optional align argument. So writing `\node at (0,0) {Function\\generator}` will not work, while `\node[align=center] at (0,0) {Function\\generator}` will work.

## Inline Mathematics

Inline math is usually typeset between dollar signs, but if this math comes at the end of a line, a line break _inside_ the mathematical expression may be inserted. To avoid this, especially for small expressions such as `x = 3` for example, we must surround the expression with curly brackets (so we get `{x = 3}`). Adding these brackets will make the math expression a _math atom_. Math atoms cannot be split.

