---
title:    "Mathematics in LaTeX"
date:     "2015-10-17T15:34:41+02:00"
draft:    false
tags:     [math, LaTeX]
support:  math
category: LaTeX
slug: "math-in-latex"
---

Easy typesetting of mathematical expressions is one of the most excellent features of LaTeX. A very wide range of mathematical options is supported and makes it one of the reasons why people in academia love LaTeX. After all, writing these expressions is quick, efficient and easy, even for complex formulas. Even if you have never used LaTeX, you will probably have seen formulas made with the (La)TeX engine. Wikipedia is one of the websites that relies on (La)TeX for mathematical expressions.
<!--more-->

## The Basics

In order to type mathematical expressions, we need to be in _mathematical mode_. To go into math mode, one typically uses the dollar sign (`$`) or the `equation` environment. Common symbols such as the sum, product and integral symbol are available by default (without any packages). However, to get full control and a more extensive set op commands, we will typically load the `amsmath` or `mathtools` package. `mathtools` loads the `amsmath` package automatically and provides some additional features. The only disadvantage of the `mathtools` package is, that it is not installed by default on all systems, and the `amsmath` package usually suffices for most tasks.

It is considered good practice if you use the dollar symbol only for in-line mathematical expressions, such as the name of a variable or small formulas. The environments (such as `equation`) are used for equations that stand on their own and larger sets of expressions. The definition of the normal distribution is, for example, not defined inline. Consequently, we use an appropriate environment. All math environments are numbered by default, to have an expression without the number, use the starred variant of the environment (`equation*`). Another commonly used environment, is the `align` environment. It is well suited for multi-line formulas and expressions.

An example of a mathematical formula is depicted below. It defines the normal distribution.

{{< highlight latex >}}
% \usepackage{amsmath} % <-- required in preamble
% \usepackage{amssymb} % <-- required in preamble
\begin{equation}
\mathcal{N}(\mu,\sigma^2) =
    \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x-\mu}{2\sigma^2}}
\end{equation}
{{< /highlight >}}

Typesets to this:

{{< math >}}\mathcal{N}(\mu,\sigma^2) = \frac{1}{\sigma\sqrt{2\pi}}e^{-\frac{x-\mu}{2\sigma^2}}{{< /math >}}

The above example is very simple for experienced users. To beginners, the code that produced this might look a bit complex at first. But once you know several simple commands, it's actually pretty simple to produce this yourself! First we notice the start and end of the `equation` environment (`\begin{equation}` and `\end{equation}`). `mathcal` is a command that makes its first argument, the letter `N` here, curly. This is a nice way to write the normal distribution in a short and simple manner. This command is not defined by the `amsmath` package however, we need to load the `amssymb` package to be able to type this. Greek letters such as sigma and mu are available by just adding a backslash. Fractions are easy too, the `\frac` command puts the first argument in the numerator and the second in the denominator. Many common mathematical function are defined by LaTeX commands: for example `\sqrt` (square root) and `\exp` (exponential function). Some (e.g. `\sqrt`) require an argument, others, such as `\exp`, don't. That does not mean we cannot write them as if they had a required argument to make our code more readable. Instead of the `\exp` function, we used the `e`-letter to denote the exponential function. Superscript is typed by adding the `^` character. Only _the next token_ is typed in subscript. So we need to add a pare of brackets to put everything in the exponent. The dual to superscript, subscript is typeset by adding an underscore (```_```).

## Number What Needs Numbering

Formulas are numbered by default, but this can be a bit cumbersome if only a handful of references to equations exist. One way to solve this problem is by adding a star (```*```) to the math-environments, but this is not very user-friendly, nor does it add the number when you do need it. A better way to add the numbers is by using a special package that handles them for you. The `mathtools` and `autonum` package provide a solution.

Loading the `autonum` package suffices to remove redundant equation numbers (even if the equation is labeled). Only if the `\ref` command (or variant) is used with the specific label, a number is inserted. `mathtools` provides similar functionality. Just add the `showonlyrefs` option as follows: `\mathtoolsset{showonlyrefs=true}`. It is important to remark that this function does not play nice with packages such as `cleveref` (a personal favourite). `autonum` is thus advised (but you need to load yet another package).

## Control Freak

### Fractions

Sometimes, you wish to nest fractions, but the nested fraction should not be smaller than the other fraction, for example: `\frac{\frac{x}{y}}{t+4}`. To avoid this behaviour, a different fraction command, `\dfrac`, has been defined. It has the same syntax as the original `\frac` command, but all symbols are of the same font size (see table with examples below).

You can even go further with the `xfrac` package. This package defined several additional fraction types you can use for different occasions. The `\sfrac` for example can be used to typeset _vulgar_ fractions, like this: ½.

{{< markdown_class "hide-800px" >}}
| `\frac` | `\dfrac` | `\ddfrac` |
|---------|----------|-----------|
| {{< inline_math "f(x,y) = \frac{\frac{x+y}{x^2}+1}{y^3+4}" >}} | {{< inline_math "f(x,y) = \dfrac{\dfrac{x+y}{x^2}+1}{y^3+4}" >}} | |
| | {{< inline_math "\dfrac{\int_0^{2\pi}\int_0^R r \exp^2{\left(-\dfrac{r^2}{w_z^2}\right)} dr d\theta}{\int_\infty^\infty\int_\infty^\infty \exp^2{\left(-\dfrac{x^2+y^2}{w_z^2}\right)} dx dy}" >}} | {{< inline_math " \dfrac{\displaystyle\int_0^{2\pi}\int_0^R r \exp^2{\left(-\dfrac{r^2}{w_z^2}\right)} dr d\theta}{\displaystyle\int_\infty^\infty\int_\infty^\infty \exp^2{\left(-\dfrac{x^2+y^2}{w_z^2}\right)} dx dy} " >}} |
{{< /markdown_class >}}

{{< markdown_class "show-800px" >}}
| `\frac` |
|---------|
| {{< inline_math "f(x,y) = \frac{\frac{x+y}{x^2}+1}{y^3+4}" >}} |
{{< /markdown_class >}}

{{< markdown_class "show-800px" >}}
| `\dfrac` |
|----------|
| {{< inline_math "f(x,y) = \dfrac{\dfrac{x+y}{x^2}+1}{y^3+4}" >}} |
| {{< inline_math "\dfrac{\int_0^{2\pi}\int_0^R r \exp^2{\left(-\dfrac{r^2}{w_z^2}\right)} dr d\theta}{\int_\infty^\infty\int_\infty^\infty \exp^2{\left(-\dfrac{x^2+y^2}{w_z^2}\right)} dx dy}" >}} |
{{< /markdown_class >}}

{{< markdown_class "show-800px" >}}
| `\ddfrac` |
|----------|
| {{< inline_math "\dfrac{\displaystyle\int_0^{2\pi}\int_0^R r \exp^2{\left(-\dfrac{r^2}{w_z^2}\right)} dr d\theta}{\displaystyle\int_\infty^\infty\int_\infty^\infty \exp^2{\left(-\dfrac{x^2+y^2}{w_z^2}\right)} dx dy}" >}}  |
{{< /markdown_class >}}

Even with the `\dfrac` command, the resulting expression can be smaller than expected (as illustrated above). Personally, I don't like such a small integral sign. To solve this, we need to add the `\displaystyle` command to the expression. However, this is not very flexible and quite cumbersome to write `\displaystyle` every time. We will define a new command, `\ddfrac`, to wrap everything nicely. With this new command, we can now exactly choose how we want the fraction (and symbols inside nominator and denominator) to be displayed. The command definition is very simple and has the same number of arguments and behaviour as the `\frac` command:<br/> `\newcommand\ddfrac[2]{\frac{\displaystyle #1}{\displaystyle #2}}`

### Brackets

Even with all the extra options provided by `amsmath` and `mathtools`, there still is no special command for absolute value. You always need to write `\lvert` and `\rvert` for the left and right bracket of the absolute value respectively. Doing this over and over again, is quite silly and makes the code harder to read. To solve this we will define a new command (see below).

Another sad thing about equations is that brackets do not automatically scale according to the content. We can solve this by typing `\left` and `\right` before the brackets (attention: every `\left` command _needs_ a `\right` command, the `\right` command is _not_ optional). Again, this can make the code quite hard to read when you have a lot of brackets. So we will also define some additional commands to have our brackets automatically scale to the contents.

A general command for the mean value does not exist, since there are several ways to write the mean value, such as an over lined or with the {{< inline_math "E[]" >}} notation for instance. We can write these directly with the appropriate commands `\overline` or `E\sbr{}`, but this is in violation to a statement above: seperate the meaning from the way content is displayed. We will thus define a command `\mean`, so we can later ally the same definition to the _entire_ document.

One way to define the commands described above, is the following (you need to be in math mode to _use_ these commands):

{{< highlight latex >}}
% \providecommand only defines the command if it is not yet defined
\providecommand{\abs}[1]{\left\lvert#1\right\rvert}
\providecommand{\br}[1]{\left( #1 \right)}
\providecommand{\sbr}[1]{\left[ #1 \right]}
\providecommand{\mean}[1]{\overline{#1}}
{{< /highlight >}}

### Multi-line Equations

In most case, you'll find yourself typing mathematical expressions that consist of only one line. To this end, the `equation` environment is well suited. However, to type multi-line equations, we need another environment. Several have been defined in the `amsmath` package, some very simple, some more complicated, but generally the latter provide more control over how things are done.

The most widely used multi-line environment is probably `align`. It is quite straightforward to use it: use the ampersand to align stuff `&` and the break sequence `\\` to start a new line. The compiler will automatically insert enough white space to separate everything. A simple example is depicted below. Notice the double use of `&` in order to left align the two text elements.

{{< highlight latex >}}
% \usepackage{amsmath} % <-- required in preamble
\begin{align}
M_i & = P - 10n\log_{10}(d) + C                      && \text{path loss}\\
    & \Rightarrow d_i = {10}^{\dfrac{M_i+C-P}{10n}}  && \text{solve for}\ d_i
\end{align}
{{< /highlight >}}

This renders to:

{{< math >}}
\begin{aligned}
M_i &= P - 10n\log_{10}(d) + C                      && \text{path loss}\\
    &\Rightarrow d_i = {10}^{\displaystyle\dfrac{M_i+C-P}{10n}}   && \text{solve for}\ d_i
\end{aligned}
{{< /math >}}

The `align` environment is widely used because of its simplicity. But that simplicity makes some things are uncontrollable, and that might frustrate some users (including myself). The entire set of equations is treated as one big block. This might lead to very large amounts of white space before the block. The solution: split the contents of align onto two pages. This can be done be setting the `\allowdisplaybreaks[1]` command in your preamble. The number indicates how freely the compiler may insert a page break. For more information about the number, see the {{< blank_url "CTAN documentation" "https://www.ctan.org/pkg/amsmath?lang=en">}}. Now, we have allowed page breaks after every `\\`. This is undesirable in some cases. To prevent a page break after a certain line ending, insert a star: `\\*`.

Another thing that sometimes needs explicit control, is the amount of white space inserted between aligned expressions. The `alignat` environment makes it possible to explicitly set the amount of white space. This environment takes one required argument: the number of equation columns. This is the number of `&`'s plus one, divided by two. Apart from the white space control, the behaviour is equal to the behaviour of the `align` environment. The LaTeX render engine does not support `alignat`, so you should run these examples through a propper LaTeX compiler.

{{< highlight latex >}}
% \usepackage{amsmath} % <-- required in preamble
\begin{alignat}{2}
M_i &= P - 10n\log_{10}(d) + C                       &\qquad& \text{path loss}\\
    &\Rightarrow d_i = {10}^{\dfrac{M_i+C-P}{10n}}  && \text{solve for}\ d_i
\end{alignat}
{{< /highlight >}}

<!--div class="math">
\begin{alignat}{2}
M_i &= P - 10n\log_{10}(d) + C                       &\qquad& \text{path loss}\\
    &\Rightarrow d_i = {10}^{\dfrac{M_i+C-P}{10n}}  && \text{solve for}\ d_i
\end{alignat}
</div-->
