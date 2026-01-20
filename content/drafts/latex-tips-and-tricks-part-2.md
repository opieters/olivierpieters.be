---
title: LaTeX Tips and Tricks 2
draft: true
---

This is a follow up post to my {{< blank_url "previous blog post" "{% post_url 2015-12-18-latex-tips-and-tricks %}">}} with small tips that fix small issues that might arise in LaTeX documents.

## Stop Using Old Commands

LaTeX2e is the most recent version (LaTeX3 is still in development) but it dates back to the 80s and has come a long way since. Things have changed, but some snippets still use older, deprecated code which might result in unstable behaviour. Avoiding this is not always easy, so there is the `nag` package that produces a warning when using a deprecated package. It also makes users aware of unreferenced floats.

To every modern LaTeX document should include the following line in its preamble:

{{< highlight latex >}}
\usepackage[l2tabu,orthodox]{nag}  % force newer (and safer) LaTeX commands
{{< /highlight >}}

All tabu commands for LaTeX2e produce a warning (`l2tabu` option). `orthodox` provides warnings when code is detected that is not technically incorrect, but will mostly do things an unwary user may not expect.

## Displayed Equations

http://tex.stackexchange.com/questions/503/why-is-preferable-to

## Fixing the Spacing of Math Functions


## Regietered signs

Sometimes, we might need/want to add a registered trademark in our text, typesetting the &reg; in superscript with `\textsuperscript` is not very efficient, so we can define a command for each such registered trademark, e.g.:

{{< highlight latex >}}
% define logos and trademarks
\providecommand{\matlab}[0]{MATLAB\textsuperscript{\textregistered}}
{{< /highlight >}}

We can now use it like this (notice the `\` after `\matlab`!):

{{< highlight latex >}}
\matlab\ (matrix laboratory) is a multi-paradigm numerical computing environment and fourth-generation programming language.
{{< /highlight >}}
