---
title:    "A Short Introduction to Creating TikZ Figures"
date:     "2015-10-09T14:08:32+02:00"
draft:    false
tags:     [LaTeX, TikZ]
support:  math
category: LaTeX
update:   2016-08-22
---

Drawing native LaTeX figures is often done using the TikZ library. This is a _huge_ package, so I won't even try to cover all the material. Instead, some simple examples that illustrate the power of TikZ are shown below. To give an idea of how massive TikZ is: its manual has over 1000 pages!
<!--more-->

When speaking of TikZ, sometimes PGF might also be meant. PGF is the base layer of TikZ that is used for drawing. PGF/TikZ has one big competitor, PSTricks. Both have their own advantages and disadvantages. I chose to invest in learning TikZ (at that time, I hadn't heard of PSTricks so, the question did not really come to mind). A discussion on advantages and disadvantages can be found {{< blank_url "here" "http://tex.stackexchange.com/questions/6676/what-are-the-advantages-of-tikz-pgf-over-pstricks" >}}.

I will just highlight some examples I used in different LaTeX documents. The idea is to give an idea of what is possible with TikZ and alike libraries.

## A Basic Example

One of the most easy things you can do with TikZ, is plot a function from its function definition (e.g. {{< inline_math "(x) = x^2" >}}). A plot is made with this very short piece of code:

{{< highlight latex >}}
% \usepackage{pgfplots} % <-- required in preamble
\begin{tikzpicture}
    \begin{axis}
        \addplot{x^2}; % <-- ; (semicolon) required!
    \end{axis}
\end{tikzpicture}
{{< /highlight >}}

{{< fig file="axis-example.svg" id="axis-example-image" alt="Axes example image" imgClass="centre-element max-400px-wide">}}

First, we need to include the `pgfplots` package, that adds the required plotting capabilities to our preamble. Next, we define a TikZ picture to enable the TikZ drawing commands. We need an axis system because we are plotting a function and finally, we plot the function with `\addplot`. Actually, we did not (directly) use the TikZ package, but the `pgfplots` package. This package is based on TikZ.

Some function might _explode_, thus a limitation in the displayed domain might be needed:

{{< highlight latex >}}
% \usepackage{pgfplots} % <-- required in preamble
\begin{tikzpicture}
    \begin{axis}[axis lines=middle,samples=200]
        \addplot[blue,domain=-3:1.85] {1/(x-2) +3 };
        \addplot[blue,domain=2.15:6] {1/(x-2) + 3};
        \draw[red!20,dashed] (axis cs:2,-4) -- (axis cs:2,10);
    \end{axis}
\end{tikzpicture}
{{< /highlight >}}

{{< fig file="axis-example2.svg" id="axis-example-image2" alt="Axes example image" imgClass="centre-element max-400px-wide">}}

## Drawing Electrical Circuits with CircuiTikZ

A simple analogue electrical circuit might look like this in LaTeX source code:

{{< highlight latex >}}
% \usepackage{circuitikz} % <-- required in preamble
\begin{circuitikz} % define a Butterworth filter (3rd order)
    \draw (-2,2) node[op amp,yscale=-1] (amp2) {};
    \draw (amp2.out) to [short,-*] (0,2) node (GA4) {};
    \draw (-1,2) to [short] (-1,0.5) node (GGA1){};
    \draw (GGA1) to [short] ($(amp2.-)-(0,1)$) node (GGA2) {};
    \draw (GGA2) to [short] (amp2.-);
    \draw (-4,2.5) node (GA2) {} to [C,l_=$C_3$] (-4,0) node[ground] (G5) {};
    \draw (GA2) to [short,*-] (amp2.+);
    \draw ($(GA2)-(2,0)$) node (GA3) {} to [R,l=$R_4$] (GA2);
    \draw ($(GA3)-(0,2.5)$) node [ground] {} to [V=$V_{in}$] (GA3);
    \draw (5,2) node[op amp] (amp) {};
    \draw (amp.-) -- ($(amp.-)+(0,1)$) node (A3) {};
    \draw (GA4) to [short] (0,3.5) node (A1) {};
    \draw (A1) to [R,l=$R_1$,-*] ($(A1) + (2,0)$) node (A2){};
    \draw (A2) to [C,l=$C_1$,] (2,0) node[ground] (G2) {};
    \draw (A2) to [R,l=$R_3$,-*] (A3);
    \draw (A3) to [C,l=$C_2$] (7,3.5) node (A4) {};
    \draw (amp.out) to [short,-*] (7,2) node (out) {};
    \draw (out) to [short,-o] ($(out)+(1,0)$) node (GA1) {};
    \draw[->] ($(GA1) - (0,2)$) node (G4) {} -- (GA1) node [midway,right] () {$V_{out}$};
    \draw (G4) node[ground] () {};
    \draw (out) to [short,-*] (A4);
    \draw (amp.+) to [short] ($(amp.+)-(0,1.5)$) node[ground] (G3) {};
    \draw (A2) to [short] ($(A2) + (0,2)$) node (B1) {};
    \draw (A4) to [short] ($(A4) + (0,2)$) node (B2) {};
    \draw (B1) to [R,l=$R_2$] (B2);
\end{circuitikz}
{{< /highlight >}}

{{< fig file="circuitikz-example.svg" id="circuitikz-example" alt="CircuiTikZ example image" imgClass="centre-element max-600px-wide">}}

Some explanation might be needed with this code, since some of the commands might look a bit weird. The `\draw` command is self explanatory. Other commands exist as well, `\node` for example. The draw command has _a lot_ of options such as line styles (solid, dashed, dashed), colours (white, blue, green etc.). The `->` option denotes the line should end on an arrow head. If we had used `-*`, it would end on a small (filled) dot. An open dot is also possible with `-o`.

Instead of defining our nodes alongside our drawing, we can also use the `\node` command. A node is (by default) an invisible element that can act as an anchor. Nodes always have at least two properties: a coordinate and a label (this can be empty). The full syntax is: `\node[<options>] at (<x-coordinate>,<y-coordinate>) {label}`. Addition of coordinates is also possible with the following syntax: `($(<coordinate 1>) + (<coordinate 2>)$)`. As seen above, `\node` can also have labeled coordinates. This means the coordinate is stored in a _variable_. This can be come in handy if one uses relative coordinates and later decides the base coordinate should change.

Finally, we need to explain how different electrical elements are drawn. Take for example this command: `\draw (-1,2) to [short] (-1,0.5) node (GGA1){};`. We draw from `(-1,2)` a short circuit (a straight line) to (-1,0.5). We also create a node at this location named `GGA1` with an empty label (`{}`). Just like the `short` element, we have resistors (`R`), capacitors (`C`), operational amplifiers (`op amp`), voltage sources (`V`) etc.

## Block Diagrams


A more high level system description might need a block diagram. The example below (based in on {{< blank_url "this question/answer" "http://tex.stackexchange.com/questions/175969/block-diagrams-using-tikz" >}}) illustrates a simple block diagram. Notice we first define several node styles, these are reused in the actual drawing. This makes it easy to change the format later on and also makes it easier to identify different nodes in the figure.

This block diagram depicts a (simple, high level) {{< blank_url "DPCM codec" "https://en.wikipedia.org/wiki/Differential_pulse-code_modulation" >}} with auto regressive models (AR-model). The `C` block is the channel encoder and the `D` block is the channel decoder.

{{< highlight latex >}}
% \usepackage{tikz}            % <-- required in preamble
% \usetikzlibrary{positioning} % <-- required in preamble
% can also be placed in preamble
\tikzset{
    block/.style = {draw, fill=white, rectangle, minimum height=3em, minimum width=3em},
    tmp/.style = {coordinate},
    sum/.style = {draw, fill=white, circle, node distance=1cm},
    input/.style = {coordinate},
    output/.style = {coordinate},
}
\begin{tikzpicture}
    \node[input, name=x_in] (x_in) {};
    \node[sum, right=2cm of x_in] (sum1) {+};
    \node[block, right=2cm of sum1] (C) {C};
    \node[tmp, right=2cm of C] (tmp1) {};
    \node[block, below=1cm of tmp1] (D1) {D};
    \node[sum, below=1.5cm of D1] (sum2) {+};
    \node[block, below=3.5cm of C] (AR1) {AR-model};
    \node[block, right=3cm of tmp1] (D2) {D};
    \node[tmp, right=2cm of D2] (tmp2) {};
    \node[sum, below=2.5cm of tmp2] (sum3) {+};
    \node[block, below=3.5cm of D2] (AR2) {AR-model};
    \draw[->] (x_in) -- node[above] {$x(n)$}(sum1);
    \draw[->] (sum1) -- node[above]{$r(n)$}(C);
    \draw[->] (C) -- node[above]{$q_r(n)$}(D2);
    \draw[->] (C) -| (D1);
    \draw[->] (D1) -- node[right]{$\hat{r}(n)$} (sum2);
    \draw[->] (sum2) |- node[right]{$\hat{x}(n)$} (AR1);
    \draw[->] (AR1) -| node[left]{$x_p(n)$} node[pos=1, below left] {$-$} (sum1);
    \draw[<-] (sum2) -| (sum1);
    \draw[->] (D2) -| node[right]{$\hat{r}(n)$}(sum3);
    \draw[->] (sum3) |- node[right]{$\hat{x}(n)$}(AR2);
    \draw[->] (AR2) |- node[above]{$x_p(n)$}(sum3);
\end{tikzpicture}
{{< /highlight >}}

{{< fig file="block-diagram-example.svg" id="block-diagram-example-image" alt="Block diagram example" imgClass="centre-element max-600px-wide" >}}
