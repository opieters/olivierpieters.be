---
title:    "Modular LaTeX Documents"
date:     "2015-12-04T14:03:23+01:00"
draft:    false
update:   "2015-12-05T14:48:21+01:00"
tags:     [LaTeX, modular documents]
category: LaTeX
---

When writing really long documents with or without other people, a single source file might not suffice. The LaTeX source file will be very long (thousands and thousands of lines). Finding your way around the document will become increasingly difficult up to a point where it is nearly impossible. Spreading the content over different files is the solution. By splitting the document per chapter or section, we avoid extremely long source files and maintain a clear view over the document structure.
<!--more-->

## Basic Project Structure

There are several ways to tackle modular documents in LaTeX. Each approach has its own advantages and disadvantages, depending on what the user prefers and expects from modular documents.

To me, the most important aspects are the following four items:

1. one main file that contains all definitions and layout options
2. other files only contain content (i.e. text, figures, tables...)
3. compilation of individual files is possible
4. hassle-free set-up from existing sources without conflicts

## Using the Subfiles Package

All of the above requirements are met by the `subfiles` package. You define the preamble in the main (top) LaTeX file that connects all other content files. The advantage of this setup is, that the preamble is located in just one file and included in the others. Another advantage is that we can compile individual source files to check for syntactical errors.

A typical directory structure of a `subfiles` project is:

{{< highlight text >}}
.
|_ Report.tex
|_ VCO.tex
|_ PLL.tex
|_ TxRx.tex
|_ FSK.tex
|_ FreqSynth.tex
|_ figures
   |_ FSKFunctioning.png
   |_ XYPLL2.pdf
|_ data
   |_ FreqSynthRangesFractions.csv
   |_ PLLPDSensitivityKP.csv
   |_ VCOFrequencyCharacteristicPlot.csv
{{< /highlight >}}

Notice that we do not have a directory for the distributed LaTeX source files. This is intentional! Inside these documents, we include data from other directories relative to the directory of the file. If we would place the main LaTeX source file in a different directory, this might cause problems for the included figures and CSV data. This is avoided by keeping a flat structure for the LaTeX source files.

If you do not include any external data, feel free to move some of the LaTeX source files into a sub directory such as `/tex`.

Below are snippets from a larger example I personally used for a report.

The main LaTeX source file:

{{< highlight latex >}}
\documentclass[11pt,a4paper,english]{article}

% modular compilation
\usepackage{subfiles}

% more preamble content

\begin{document}

  \subfile{titlepage}

  \tableofcontents

  \subfile{VCO}
  \subfile{PLL}
  \subfile{TxRx}
  \subfile{FSK}
  \subfile{FreqSynth}

\end{document}
{{< /highlight >}}

A subfile:

{{< highlight latex >}}
\documentclass[english,PLL-report.tex]{subfiles}

\begin{document}

  \section{Characterising the VCO}

  \subsection{Sizing the Timing Components}

  In order to obtain the correct VCO timing parameters ($f_{0,\text{desired}} =
  \unit{230}{\kilo\hertz}$), we used this formula from the data sheet:

  \begin{equation}
    f_0 = \dfrac{0.3}{R_TC_T}
    \label{eq:Expectedf0}
  \end{equation}

  To meet this condition, we select a resistance $R_T$ of \unit{820}{\ohm} and
  a capacitance $C_T$ of \unit{1.5}{\nano\farad}. The measured values of these
  components are \unit{820}{\ohm} and \unit{1.483}{\nano\farad} respectively.

  % additional content

\end{document}
{{< /highlight >}}

## Other Possibilities: the Input and Include Macros

There are two popular alternatives for the above package: the `\include` and `\input` commands. Both commands will process the file contents of their arguments first and then continue with the rest of the document. There are however some subtle differences between the two. The `\include` commands does _not_ allow additional `\include` statements inside included files in contrast to `\input`. Additionally, `\include` will trigger a `\clearpage`. The content will thus always start on a new page in the main document.

Both commands do not require the `.tex` file extension and work with relative paths. The main disadvantage is that you always need to compile the entire document to be able to check the output and not individual files.

If you work with `\include`, there is a workaround if you just want to compile one of the files. We can use the `\includeonly` command. It takes the filenames that _need_ compilation as (comma sparated) arguments and compiles only these. Spaces are not allowed in this list (since file names can contain spaces) and the use of file name extensions is not recommended, as is the use of file extensions in the `\include` and `\input` commands, but if you do use file extensions, be consistent!

## Fixing the Subdirectory Issue

If we really want the following directory structure, there is a way to do this with a little hack of different commands. This is based on an {{< blank_url "answer" "http://tex.stackexchange.com/questions/153312/subfiles-inside-a-subfile-using-relative-paths">}} on StackExchange.

We want to have the following file layout:

{{< highlight text >}}
.
|_ Report.tex
|_ tex
   |_ VCO.tex
   |_ PLL.tex
   |_ TxRx.tex
   |_ FSK.tex
   |_ FreqSynth.tex
|_ figures
   |_ FSKFunctioning.png
   |_ XYPLL2.pdf
|_ data
   |_ FreqSynthRangesFractions.csv
   |_ PLLPDSensitivityKP.csv
   |_ VCOFrequencyCharacteristicPlot.csv
{{< /highlight >}}

To get this file structure, we make use of the a small hack. We will define the directory relative to the main file directory in a new command, `\main`. We will need to define this in _every_ subfile with in the following way:

{{< highlight latex >}}
\providecommand{\main}{..} % in a .tex file in the /tex directory
\providecommand{\main}{.} % in the main .tex file
{{< /highlight >}}

The important thing is the _location_ of this command. In the main source file we will place it after the `\documentclass` macro. This is the usual way of defining new macros in LaTeX. But in the LaTeX source files in the `/tex` folder, we will define it _before_ the `\documentclass` macro. The use of `\providecommand` ensures we do not overwrite the macro definition if it is already defined, because all the preamble content from the main source file will be inserted into its empty preamble.

The above hack ensures that relative directories are correct inside the top LaTeX source file that will produce the final output. This would not be the case with the regular way of using the `subfiles` package. Additional subfiles (insude subfiles) are possible, if the `\main` macro is correctly defined.

An all-inclusive example is depicted below:

The top (main) LaTeX source file looks like this:

{{< highlight latex >}}
\documentclass[11pt, a4paper, english]{article}

% modular compilation
\usepackage{subfiles}
\providecommand{\main}{.}

% additional content

\begin{document}

  \subfile{tex/VCO.tex}

  % additional document content

\end{document}
{{< /highlight >}}

And one of the files in the `/tex` folder might look like this:

{{< highlight latex >}}
\providecommand{\main}{..} % <-- before \documentclass!
\documentclass[english,\main/PLL-report.tex]{subfiles}

\begin{document}
  % document content
\end{document}
{{< /highlight >}}

## Examples

All three popular methods have an example in this zip-file:

{{< dfile type="zip" file="modularLaTeX.zip" >}}

