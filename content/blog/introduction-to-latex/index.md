---
title:    "Introduction to LaTeX"
date:     "2015-09-21T08:34:41+02:00"
update:   "2019-08-30T09:32:23+02:00"
draft:    false
tags:     [LaTeX]
category: LaTeX

---

There has already been written a lot about whether or not you should use LaTeX. So here, yet another (blog) post that tries to convince you to use LaTeX (when needed) and how to use it. It only sketches a _brief_ introduction to the typesetting system. In later posts, I will highlight several aspects of LaTeX in greater detail.
<!--more-->

{{< blank_url "(La)TeX" "http://www.latex-project.org" >}} is a typesetting system. It is heavily used to create reports, long documents, articles, letters, and even slides. This diversity in use, combined with powerful syntax and typographical and layout consistency, have lead to the worldwide spread of (La)TeX. It is the de-facto standard for scientific and technical documents. (La)TeX encourages writers to focus on content first and layout later. This is done by separating the way a document is made and the way it looks. However, this separation is much less strict than other standards such as `HTML5 + CSS3`.

LaTeX is essentially a set of macros a user uses for document preparation. LaTeX uses these macros to wrap TeX commands. Thus, LaTeX is a higher-level language than TeX. These commands try to abstract low-level TeX functionality to easier to use functions (macros). Document writing should be easier and faster in LaTeX than plain TeX. LaTeX is not the only super-set of TeX. ConTeXt, XeTeX, and LuaTeX are just a few examples of other typesetting systems that are TeX based. New releases of TeX only fix bugs because the aim is to keep output consistent across version (except for bugs). Although the latest release was in 2014, TeX is a very stable system.

## Why LaTeX?

When you first look at a document that was produced with LaTeX, you will probably immediately notice the difference with a Word, Pages or Writer document (if not only by the typical LaTeX font). After typesetting, a LaTeX document will have a consistent layout from the first to the last page. This is not always the case with typical {{< blank_url "<abbr title=\"What You See Is What You Get\">WYSIWYG</abbr>" "https://en.wikipedia.org/wiki/WYSIWYG" >}} editors.

LaTeX is very good at making high-quality _mathematical documents_. Formulas are rendered by using commands (such as `\frac`, which makes it much fast and easy to manipulate mathematical expressions. Another very important thing is that native LaTeX figures are _vector-based_. This means that figures created in LaTeX (mostly with the extensive TikZ library) remain sharp, no matter what the scale is. This is not the case with pixel-based formats (jpeg, png; pixel-based figures can be included in a LaTeX). If you zoom too much the picture becomes blurred. Vector-based images do not store the result (displayed pixels) but the way the image is constructed with drawing commands, like e.g. `DRAW LINE (0,0) -- (1,2)`. TikZ is the most used library for drawing graphics in LaTeX documents.

The result of a LaTeX document that is printable, is different from what was entered in the editor. In a LaTeX editor, one edits the source file. This is a combination of regular text and commands that add formatting, styling, and figures. The source file is typically plain {{< blank_url "ASCII" "https://en.wikipedia.org/wiki/ASCII" >}} or {{< blank_url "UTF-8" "https://en.wikipedia.org/wiki/UTF-8" >}}. To produce the final output, a LaTeX source file has to be compiled. Creating a LaTeX document is thus nothing more than combining text and commands that result in a document. The output document is typically a PDF- or DVI-file (other formats are possible too).

## Comparing LaTeX with Word Processors

The difference between LaTeX and typical word processors such as Microsoft Word, Pages and OpenOffice Writer is the way they work. LaTeX is an example of a {{< blank_url "WYSIWYM" "https://en.wikipedia.org/wiki/WYSIWYG" >}} system. The others are all {{< blank_url "WYSIWYG" "https://en.wikipedia.org/wiki/WYSIWYG" >}} systems. So, LaTeX is fundamentally different from the others. Content and representation are separated in LaTeX. Representation is created by using the semantics that is added to the text through commands. In other examples, the result is displayed on the screen.

In many cases, LaTeX is an alternative to a more classical word processor. Documents such as reports, letters, curricula vitae, (small) books and so on, are easily created using LaTeX. Once you know the basics of LaTeX, starting a LaTeX document is very easy and requires a little more time than starting a document with a WYSIWYG word processor. However, sometimes LaTeX a less optimal choice. Especially in documents that require exact positioning of text and images, such as magazines, LaTeX is not a good choice. In those cases, InDesign and FrameMaker are far better choices. Also, when you need to produce a document quickly, WYSIWYG is a better choice.

The power of LaTeX especially arises when writing larger documents because of extendibility with packets and consistent typesetting. By adding semantics to the text (in the form of commands that have the same meaning throughout the document), one can produce documents of very high typographical quality. By using commands throughout the document, one makes sure that when you later decide the layout of text formatted with a certain command should change, this change is consistent throughout the document. This is not always the case with WYSIWYG word processors. LaTeX also can work modularly. Splitting a document per chapter is not uncommon and helps to keep everything organized. Besides, images and other foreign content are always contained in separate files. This way, the source files' size does not become too large when writing large documents with lots of photos.

When someone learns LaTeX, the time to get everything going is larger (as indicated in the [figure below](#latex-vs-word)). This throws off some new users that try LaTeX. This initial threshold does yield over time when word processors such as Pages start having consistency problems that need to be fixed. Thus, LaTeX requires a certain investment from the user (learning the commands and typical quirks of LaTeX), but the investment is well worth it!

{{< fig file="latex-vs-word.svg" id="latex-vs-word" alt="LaTeX vs. Word" imgClass="centre-element max-400px-wide" caption="LaTeX versus a typical WYSIWYG word processor. Figure inspired on <a href=\"http://www.jaftalks.com/wp/index.php/latex-or-microsoft-word-in-it-organization/\">this post</a> by Hassan Jaffal." >}}

## The Basics

A typical LaTeX document looks like this:

{{< highlight latex >}}
\documentclass[11pt, a4paper, english]{article}

\usepackage[l2tabu, orthodox]{nag} % force newer (and safer) LaTeX commands
\usepackage{babel}
\usepackage{lipsum}

% here starts the actual document
\begin{document}

\section{First section}

  \lipsum[1]
  \subsection{A subsection}

  \lipsum[2-4]

\section{Another section}

  \lipsum[5-10]

\end{document}
{{< /highlight >}}

Everything before the document environment (marked by `\begin{document}` and `\end{document}`) is called the preamble. The purpose of the preamble is to set certain options and settings and include packages that are needed in the rest of the document.

As depicted in the example above, we first define the document type and some of its properties (font size, paper size, and language respectively). Possible document types are `book`, `report`, `article`, and `beamer` (others are possible). By setting one of these, you activate several commands such as `\chapter`. The `\chapter` command is only available in the `book` and `report` classes. You can read more about the basics of the preamble {{< blank_url "here" "https://en.wikibooks.org/wiki/LaTeX/Document_Structure#Preamble" >}}.

Next, we load all of our packages (in braces `{}`) with the `\usepackage` command. Sometimes we want to set specific options for these packages, this is done by listing them in square brackets. These options are optional (since they are in square brackets, this is a general LaTeX convention). Some commands require several arguments, these arguments are always surrounded by braces. Thus we see the package name is q required argument to load the package.

The actual document follows after the preamble. This contains all of your content that will be displayed. As explained above, commands are used to format the text and give meaning to certain parts of it. The `\section` command is one of those commands. Its function is self-explanatory. Finally, we can also have comments in our LaTeX source file. Comments always start we percentage symbol and will be ignored by the TeX compiler.

So, that rounds up this first real blog post. I hope you enjoyed reading it! Feedback is always welcome, just click the link in the footer.
