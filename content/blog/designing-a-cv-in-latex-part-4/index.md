---
layout: post
title:  "Designing a Curriculum Vitæ in LaTeX – Part 4: Cover Letter Design and Conclusion"
tags:   [limecv, curriculum vitae, LaTeX, TikZ]
date:   "2017-11-05T14:18:00+02:00"
slug: "designing-a-cv-in-latex-part-4"
---

In this fourth and final part of this series on the design of a curriculum vitæ in latex, we are going to have a look at the cover letter. An essential part, that should be part of the same design as the CV itself. 

<!--more-->

The previous articles are:

* _Designing a Curriculum Vitæ in LaTeX – Part 1: Concept and General Design_ which can be found [here]({{< relref "designing-a-cv-in-latex-part-1/index.md" >}});
* _Designing a Curriculum Vitæ in LaTeX – Part 2: Sidebar Design_ which can be found [here]({{< relref "designing-a-cv-in-latex-part-2/index.md" >}});
* _Designing a Curriculum Vitæ in LaTeX – Part 3: Main Section Design_ which can be found [here]({{< relref "designing-a-cv-in-latex-part-3/index.md" >}}).

## Cover Letter Design

The design of the cover letter is the easiest of the entire CV, since there is no need for very complex alignment and the document does not feature an involved two-column layout. As usual, we will start by adding some definitions to our preamble.

{{< highlight latex >}}
\newlength\coverletterheight
\setlength\coverletterheight{\cvSideWidth}
\newlength\coverletterwidth
\setlength\coverletterwidth{\cvMainWidth+3\cvMargin}
{{< /highlight >}}

`\coverletterheight` is the height of the coloured bar we'll put on top. `\coverletterwidth` is the width of the content inside the cover letter. Both are set to reasonable defaults.

To make sure everything ends up on a new blank page, add a `\clearpage` before starting the TikZ environment. Now, let's start the actual design. First, we are going to add our name and job title (or similar):

{{< highlight latex >}}
\begin{tikzpicture}[remember picture,overlay]
  \begin{scope}[on background layer]
    \fill[cvGreenLight] (current page.north west) rectangle ++(\paperwidth,-\cvCoverLetterHeight);
  \end{scope}
  \draw (current page.north east) ++(-0.5\paperwidth+0.5\coverletterwidth,-\coverletterheight/2) node (h7) {};
  \matrix[anchor=east,row sep=10pt] at (h7) {%
    \node (cv cover letter name){\fontsize{50}{60}\selectfont John Doe}; \\
    \node[align=right,cvAccent]{Position}; \\
  };
  \begin{scope}[on background layer]
    \draw[line width=3pt,cvGreen] 
      (cv cover letter name.south west) to (cv cover letter name.south east);
  \end{scope}
\end{tikzpicture}
{{< /highlight >}}

Since the above code will not add the required vertical space to make it non-overlapping with the cover letter, we need to add this space manually:

{{< highlight latex >}}
\vspace{\coverletterheight}
{{< /highlight >}}

Now, we are starting the actual letter. We encapsulate everything inside a `minipage` (with a width of `\coverletterwidth`). We need to wrap this in a `center` environment to center the letter. We can now add the date.

{{< highlight latex >}}
\begin{center}
\begin{minipage}{\coverletterwidth}
\today

\vspace{\baselineskip}
{{< /highlight >}}

We also need to add the beneficiary. To this end, we can use a table to keep everything together. I defined the following command to make it easier to typeset everything:

{{< highlight latex >}}
\NewDocumentCommand{\cvBeneficiary}{mmmmmm}{%
  \begin{tabular}{@{}l}
    \MakeUppercase{#1 #2} \\
    #3 \\
    #4 \\
    #5 \\
    #6 \\
  \end{tabular}%
}

\cvBeneficiary{Jane}{Smith}{Position}{Company}{Address line 1}{Address line 2}
{{< /highlight >}}

Afterwards, we add the salutation, some whitespace and the actual contents. In the example code, there is an excerpt from Lorem Ipsum, but this is not included here.

{{< highlight latex >}}
\vspace{\cvMargin}

Dear Miss.\ Smith

\vspace{\baselineskip}

% actual contents
{{< /highlight >}}

Finally, we add our name and close the remaining environments. 

{{< highlight latex >}}
\vspace{\cvMargin}

John Doe

\end{minipage}
\end{center}
{{< /highlight >}}

The resulting cover letter is depicted in the figure below.

{{< fig file="cover_letter.svg" id="cv-cover-letter" class="centre-element max-500px-wide" alt="Lime CV cover letter." imgClass="frame" >}}

## Conclusion

During the course of four blog posts we explored how we can create a custom CV in LaTeX with a (relatively) limited amount of code. The result is a CV that looks professional, clean and unlike any other LaTeX CV (I've come across).

Since a lot of coding is required to make everything work well, I've created a document class that is {{< blank_url "available on CTAN" "https://ctan.org/pkg/limecv" >}}. The {{< blank_url "source code" "https://github.com/opieters/limecv" >}} can be downloaded on GitHub and the project homepage can be found {{< blank_url "here" "projects/limecv.md" >}}.

<div class="row">
  <div class="six columns">
      {{< fig file="limecv_main.svg" id="cv-main-final" alt="Sidebar and main content section." imgClass="frame" class="centre-element max-500px-wide">}}
  </div>
  <div class="six columns">
    {{< fig file="cover_letter.svg" id="cv-cover-letter-final" class="centre-element max-500px-wide" alt="Lime CV cover letter." imgClass="frame">}}
  </div>
</div>


