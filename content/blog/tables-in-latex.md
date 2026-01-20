---
title:    "Tables in LaTeX"
date:     "2015-11-11T14:34:41+01:00"
draft:    false
tags:     [LaTeX, tables, tabular, tabularx]
category: LaTeX
---

Tables in LaTeX are very easy to do once you know a little bit about the syntax. The default way to create tables is with `tabular`, an environment that creates an n-by-m table that can be filled with data (and sub-tables).
<!--more-->

## Creating Tables

As already mentioned, the most used table environment is `tabular`. Its simple syntax allows to create tables within minutes. Below is an example.

{{< highlight latex >}}
\begin{table}
  \centering                       % centre table
  \begin{tabular}{l|c}
    bits   &   constellation point \\
    \hline                         % rule end (\\) not needed
    00     &   $\dfrac{\pi}{2}$    \\
    01     &   0                   \\
    10     &   $-\dfrac{\pi}{2}$   \\
    11     &   $\pi$
  \end{tabluar}
  \caption{4-FSK mapping (Gray)\label{4FSKGray}}
\end{table}
{{< /highlight >}}

First, we nest the `tabular` environment (the actual table) inside a table-float. Inside this float, we can define a `\caption` and label. These are very useful for referencing. The `tabular` environment has one required argument: the column layout specification. This defines the alignment of the content and the locations of column-seperating lines (denoted by the pipe symbol, `|`). Each sequential token defines a property, from left to right. You can use each of the following alignment specifiers for a particular column: `r` for right alignment, `c` for centered alignment and `l` for left alignment. After defining our column-layout, we can define our rows. The content of individual cells is separated by an ampersand `&` and the end of the row must be the line-break command `\\`.

Applying the above knowledge to the example yields: we define a left-aligned column and a centered column separated by a vertical line.

As displayed in the example code above, an horizontal line can be inserted with `\hline`, a vertical line can be inserted with `\vline`. The `&` and `\\` are not compulsory for the `\hline` row, leaving them out makes the source code much more easy to read!

Sometimes it might be needed to create a table with specified width. In the case of a large table entry for instance, the use of `tabular` will result in a `hbox overfull` warning because the entry will not wrap. `tabular*` and `tabularx` (`tabularx` requires the used to load the `tabularx` package) both provide solutions and have similar syntax.

Another possibility is to read tables from files. This is usually done with `pgfplotstable` as described in the [Inserting Data From File in LaTeX for Plotting]({{< ref "/blog/latex-plotting-from-file/index.md" >}}) post.

## Equal width columns

Sometimes, you want to be able to specify the column width, but this cannot be done by default. However with the code below, it can be done inside a regular `tabular` environment. First we need to add some new column definitions to our preamble. These can be used just like the regular `c`, `r`, `l` specifiers in the `tabular` environment. Note we also added the `\arraystretch` command. This adds some additional spacing between rows (the minimum row hight is now at least 2cm in the example).

The code below is inspired by [this](http://tex.stackexchange.com/questions/12703/how-to-create-fixed-width-table-columns-with-text-raggedright-centered-raggedlef) StackExchange question.

{{< highlight latex >}}
% required in preamble:
\newcolumntype{L}[1]{>{\raggedright\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{C}[1]{>{\centering\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}
\newcolumntype{R}[1]{>{\raggedleft\let\newline\\\arraybackslash\hspace{0pt}}m{#1}}

% in document:
\renewcommand{\arraystretch}{2}    % space between adjacent rows
\begin{table}
  \centering                       % centre table
  \begin{tabular}{C{1.5cm}|C{1.5cm}}
    bits   &   constellation point \\
    \hline                         % rule end (\\) not needed
    00     &   $\dfrac{\pi}{2}$    \\
    01     &   0                   \\
    10     &   $-\dfrac{\pi}{2}$   \\
    11     &   $\pi$
  \end{tabluar}
  \caption{4-FSK mapping (Gray)\label{4FSKGray}}
\end{table}
{{< /highlight >}}

In short, we define new columns (for the three kinds of alignments). First we set the alignment (e.g. `\raggedright`). After this, we _define_ a new command, `\newline`, because we want to be able to break lines inside the cell entry. Then we issue the `\arraybackslash` command to allow `\\` to end a row (default LaTeX way of ending a row). Finally we insert some non-existing horizontal spacing to allow hyphenation of the first word. The example code is self explanatory.
