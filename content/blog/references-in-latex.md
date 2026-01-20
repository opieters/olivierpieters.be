---
title:    "References in LaTeX"
date:     "2015-11-20T14:34:41+01:00"
draft:    false
tags:     [LaTeX, references, cleveref, hyperref]
category: LaTeX
---

Good referencing is one of the things LaTeX excels at. LaTeX supports an easy and powerful syntax for referencing to tables, sections, figures etc. These references can even behave like links we know from the web.
<!--more-->

## The Basics - Creating Labels and Using the Default Referencing Mechanism

Mostly, we will refer to floats (figures, tables...) and mathematical expressions. In order to be able to refer to these objects, we need to assign them a label. We can later use this label to create the reference and, if desired, a link to this reference. Creating a label is very simple: `\label{<label name>}`. We can practically use any name (including spaces) for this label, but it is advised to use a _meaningful_ name. Later, when we need to really use it, we can easily find it again using the semantics we gave to the label. An example of a good label-name is `BoltzmannDistribution`, a bad name would be `formula1`. Using the same label multiple times is allowed and the last definition will be used from that point on in the document. However, LaTeX will output a warning that this label is already used.

The default way to reference a label is with the `\ref{<label name>}`. This will _only_ add the number of the specific label. The user needs to know wither this label is a section, figure, table, listing etc. This can be solved with additional packages (continue reading) and is a limitation of the `\ref` command. A quick solution would be to use the following naming convention:

| type       | abbreviation |
|------------|--------------|
| section    | sec          |
| subsection | sec          |
| formula    | eq           |
| table      | tab          |
| figure     | fig          |
| listing    | lst          |

Example: `\label{eq:ConicSection}`

With the above convention it is obvious what the label type will be when inserting it with `\ref`. However, changing a table to a graph will require the user to change all labels.

Before concluding this section, it is important to note two items. If we type e.g. `See figure \ref{fig:example}.`, the word figure and reference number might end up on a different line. This is undesirable! To avoid this, use a tilde between the two: `See figure~\ref{fig:example}.` This tells LaTeX that we do not want the two to be separated over several lines. Another important item is the location of the `\label` command. If a _wrong_ location is used, it might not function properly. Below are some guidelines:

For chapters, sections and subsections, use the `\label` inside the command (outside works too, but inside it makes more sense):

{{< highlight latex >}}
\section{<section name>\label{sec:asection}}
{{< /highlight >}}

A single line formula label should be after the formula:

{{< highlight latex >}}
\begin{equation}
  <math formula>
  \label{eq:formula}
\end{equation}
{{< /highlight >}}

Individual lines can be referenced with a label before the line end (`\\`):

{{< highlight latex >}}
\begin{align}
  <math formula> \label{eq:theorem} \\
  <math formula> \\
  ...
  <math formula> \label{eq:result}
\end{align}
{{< /highlight >}}

Labels for tables, figures, listings, floats in general are best located inside or after the caption:

{{< highlight latex >}}
\begin{table}
  <table content>
  \caption{Some table.\label{tab:SomeTable}}
\end{table}
{{< /highlight >}}

## Cleveref - Inserting References the Smart Way

Using the `\ref` command is very easy, but not really flexible. When we change a theorem to a lemma, or a table to a float, we need to check where a reference is located to that particular item and update the text in front. For very large documents, we need to avoid this. The `cleveref` package provides a solution. It provides the `\cref` command. This command adds both the item-type and reference label.

Inserting references is done in exactly the same way, but instead of typing `See figure~\ref{fig:example}.`, we now type `See  \cref{fig:example}.`. The command cannot know if it is at the beginning of a sentence or in the middle. To get a capitalized version another analogous command can be used: `\Cref`. This command has exactly the same syntax.

We can also provide multiple labels inside the `\cref` command and they will all be typeset either as a enumeration or range, depending on the types (do not use a space after the argument separating comma, because labels can also contain spaces). A more sophisticated range is possible with `\crefrange` (and `\Crefrange`). To get the reference number, without its name, use: `\namecref{<label>}`.

## Tips and tricks

### Hierarchic numbering

By default, the numbering is global inside an article. A reference number does not indicate the section it was defined in. For longer articles, this might be undesirable. We can fix this with the `\numberwithin{<float>}{<heading>}` command.

Some examples:

{{< highlight latex >}}
\numberwithin{equation}{section}
\numberwithin{figure}{section}
\numberwithin{table}{section}
{{< /highlight >}}

### Hyperlinks

After typesetting the document (several times), all references will be correct. However, navigating to a specific item might be cumbersome. To enable a hyperlink-like behaviour inside our document, we can load the `hyperref` package: `\usepackage{hyperref}`.

### Cleveref

By default, `cleveref` displays an abbreviation of the label type (e.g. Fig.). I do not really like this. Add the `noabbrev` option when loading the package to have the full name.

It is also possible to include both name and number in the hyperlink that allows us to quickly navigate the document with the `nameinlink` option.

To enable both options, use: `\usepackage[nameinlink,noabbrev]{cleveref}`.

When using the `cleveref` package in combination with the `hyperref` and `autonum` packages and hierarchic number, one needs to be very careful with the order in which these are called. A wrong order will result in errors. The correct order is:

{{< highlight latex >}}
\numberwithin{equation}{section}
\numberwithin{figure}{section}
\numberwithin{table}{section}

\usepackage{hyperref}
\usepackage{cleveref}
\usepackage{autonum}
{{< /highlight >}}
