---
title:    Defining New LaTeX Macros
date:     "2016-09-09T17:39:00+02:00"
draft:    false
tags:     [macro, LaTeX, command]
support:  math
category: LaTeX
---

LaTeX is a macro language on top of TeX; there are thousands of packages available that define all sorts of macros (commands) one can use in our documents. But sometimes they just don't cover what we want or need. Often the solution is defining a new command. For very simple commands, this is straightforward, but if we want (or need) flexibility, things become more involved. We will take a look at good (and bad) approaches to define new macros in LaTeX.
<!--more-->

## Simple Commands

`\def` is a typical TeX macro to define other macros. Since it is a pure TeX primitive, issues arise quickly. No one should ever use this directly. Instead, we should to use `\newcommand`, a built-in LaTeX macro.

All usages of `\newcommand` should follow the following syntax:

{{< highlight latex >}}
\newcommand{name}[num][default]{definition}
{{< /highlight >}}

Let's illustrate the usage with several examples. First, we define a command `\foo` that prints outputs `bar`:

{{< highlight latex >}}
\newcommand{\foo}{bar}
{{< /highlight >}}

Easy right? Now, let's automatically add a registered trademark ® in superscript. In order for this to work, we need one argument: the trademark itself. The line of LaTeX needed to define this, is:

{{< highlight latex >}}
\newcommand{\regtm}[1]{#1\textsuperscript{\textregistered}}
{{< /highlight >}}

What we did is pass the name as `\regtm`, signal that we need one required argument and then used that argument (the `#1`) in the definition. We can use up to nine arguments in LaTeX and use them by typing `#1` through `#9`. For those that need more than nine arguments: this is not possible without a TeX hack. If you really need it, read "{{< blank_url "How to break the 9-argument limit" "http://www.tex.ac.uk/FAQ-moren9.html" >}}".

We can now typeset "MATLAB<sup>®</sup>" as follows:

{{< highlight latex >}}
\regtm{MATLAB}
{{< /highlight >}}

Only one option in the syntax definition of `\newcommand` remains unused: the default field. Using the default field, we can set a default value for the _first_ argument. Suppose we want to define the following test command:

{{< highlight latex >}}
\newcommand{\test}[1][1]{test #1}
{{< /highlight >}}

Then we will get `test 1` if we use `\test` and `test 3` if we used `\test[3]`. Notice the usage of square brackets and not curly brackets, since we are specifying an optional argument.

The above example also illustrates very well how LaTeX processes spacing. Suppose we have `\test` somewhere in the middle of a sentence:

{{< highlight latex >}}
This command prints a test message: \test for example.
{{< /highlight >}}

Then this will be typeset as: "This command prints a test message: test 1for example." Notice the missing space between "1" and "for". To get a space, we need to type:

{{< highlight latex >}}
This command prints a test message: \test\ for example.
{{< /highlight >}}

But why is this? LaTeX always ignores spacing _after_ macros without argument because there is no other way to distinguish between the text and macro (and double spaces are always converted into a single space). To fix this, we need to tell LaTeX we want a space after the macro. This is done using `\ `. This will always work, even if there is a line break immediately after the macro. This alo explains why the following example does have correct spacing:

{{< highlight latex >}}
This command prints a test message: \test[5] for example.
{{< /highlight >}}

We do have an argument here, so there's no need to add a backslash. When we type `\test{}`, a space will also be inserted. However, this is rather ugly since `{}` will create an empty TeX atom. There won't be a space between the command and the atom, but there will be one between the atom and the subsequent text if you typed a space. This however is not what we intend to write: a space between the macro and the text that follows.

A final example that illustrates the usage of both a required and optional argument:

{{< highlight latex >}}
% requires the amsmath package
\newcommand{\intx}[2][x]{\int#2\,\text{d}#1}
{{< /highlight >}}

This commands defines an alternative integration macro that includes the differential. Since most functions have <span class="inline_math">x</span> as variable, it's reasonable to set the default integration variable to <span class="inline_math">x</span>. Some example usages and results (don't forget that we need to be in math mode and load the `amsmath` package for these commands to work):

{{< highlight latex >}}
\intx{\frac{\sin x}{x}}
{{< /highlight >}}

<div class="math">\int\frac{\sin x}{x}\,\text{d}x
</div>

{{< highlight latex >}}
\intx[u]{\frac{\sin u}{u}}
{{< /highlight >}}

<div class="math">\int\frac{\sin u}{u}\,\text{d}u
</div>

`\newcommand` will always check if the macro has not been defined yet. If the command has already been defined, `\newcommand` will prompt an error message. There is only the possibility to add one optional argument. If we need more optional arguments, a more complicated setup is needed.

How to redefine a command? Simple, use `\renewcommand`. The syntax is exactly the same. However, how to use the original command when defining my own version? We can't just type `\renewcommand{\section}[1]{\section{Awesome #1}}`... What we need is the TeX `\let` primitive. Thus, first assign a new command with the `\let` primitive and then use that command in `\renewcommand`. For example:

{{< highlight latex >}}
\let\oldsection\section
\renewcommand{\section}[1]{\oldsection{Awesome #1}}
{{< /highlight >}}

For more information on the difference between `\def` and `\let`, read {{< blank_url "read this stackexchange answer" "http://tex.stackexchange.com/questions/258/what-is-the-difference-between-let-and-def" >}}.

There is one final possibility: we need to define a command, but if it has been defined already, we don't need to take action. `\providecommand` exhibits this functionality. Again, it has the same syntax as `\newcommand`, but it will not output an error if the command is already defined. In fact, it won't do anything in this case.

If we experience problems when including commands within a figure caption for example, it might be worth trying to replace `\newcommand` with `\DeclareRobustCommand`. This will be useful for macros that are expanded and included into auxiliary files. Why not use `\DeclareRobustCommand` all the time? It's less efficient and does not check if the macro has been defined already ({{< blank_url "source" " http://tex.stackexchange.com/questions/61503/newcommand-vs-declarerobustcommand" >}}.

## Liberate Macro Definitions (with LaTeX3)

The LaTeX3 project is still under way, but we can already use several of its packages. `xparse` is one of these. The objective of this package is to replace `\newcommand` (and similar macros) in favour of more extendable macros. It provides much more flexibility and will (probably) in the future become more important and widely used.

I will only highlight `\NewDocumentCommand` in one example here, there are many other possibilities. We will discuss how to define the `\intx` macro with `\NewDocumentCommand`.

The original definition:

{{< highlight latex >}}
\newcommand{\intx}[2][x]{\int#2\,\text{d}#1}
{{< /highlight >}}

The new definition:

{{< highlight latex >}}
\NewDocumentCommand{\intx}{O{x} m}{\int#2\,\text{d}#1}
{{< /highlight >}}

The usage is exactly the same as before. However, we can now flip the mandatory and optional arguments, this makes the usage more readable, since the differential always comes last:

{{< highlight latex >}}
\NewDocumentCommand{\intx}{m O{x}}{\int#2\,\text{d}#1}
{{< /highlight >}}

And now we can issue: `\int{u}[u]`.

## More Complicated Designs and Closing Remarks

### Math Mode

The `\intx` macro we defined above always needs to be used in math mode. As a consequence, we need to type: `$\intx{x}$` and not `\intx{x}`. For this specific command, this is not a real issue. But suppose we want to define a subset of the integer numbers: <span class="inline_math">Z_{2n}</span>. Then it is more convenient to write `\Z[2n]` in the text than `$\Z[2n]$`. But adding the dollar signs inside the definion will break support if it is include inside a math environment. The solution is `\ensuremath`. If we define the macro as follows, we can support `\Z[2n]` both in text and math mode:

{{< highlight latex >}}
\newcommand{\Z}[1][n]{\ensuremath{Z_{#1}}}
{{< /highlight >}}

### Key-Value Arguments

There are even more possibilities: how about a key-value system. With this kind of setup we can issue: `\box[hight=5em,width=6em]{Contents}`. To achieve this kind of flexible syntax, one can use the `keyval` packate or a `pgfkeys` setup, as {{< blank_url "discussed here" "http://tex.stackexchange.com/questions/34312/how-to-create-a-command-with-key-values" >}}. This is beyond the scope of this blog post, since these facilities are usually only used by package developers.


