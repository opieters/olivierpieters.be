---
layout: post
title: "Designing a Curriculum Vitæ in LaTeX – Part 3: Main Section Design"
tags: [limecv, curriculum vitae, LaTeX, TikZ]
date:     "2017-10-29T11:27:00+02:00"
slug: "designing-a-cv-in-latex-part-3"
---

This is the third blog post in a four-part series on the design of the `limecv` document class. In this third blog post, we will design the main content section. This part will contain information such as your previous experience and education. Placing elements in this part will be the most difficult part. To make spacing elements easier, we'll wrap everything in a `tikzpicture` environment.

<!--more-->

The previous articles are:

* _Designing a Curriculum Vitæ in LaTeX – Part 1: Concept and General Design_ which can be found [here]({{< relref "designing-a-cv-in-latex-part-1/index.md" >}});
* _Designing a Curriculum Vitæ in LaTeX – Part 2: Sidebar Design_ which can be found [here]({{< relref "designing-a-cv-in-latex-part-2/index.md" >}}).

## Designing the Main Content Section

After adding all the info to the sidebar, it's time to start working on the main section. This section will contain the details about your education, experience and interests. Before staring to write the actual contents, we need to define a few new lengths and macros in the preamble.

### Configuration and Preamble Settings

First we define the `\cvTimeDotSep` length. This length will define the spacing between the icon that each section will have and the title of that section. Additionally, this will also be the spacing between the timeline and the events on that timeline, hence the name. Let's set this length to 0.4&nbsp;cm for now:

{{< highlight latex >}}
\newlength\cvTimeDotSep
\setlength\cvTimeDotSep{0.4cm}
{{< /highlight >}}

Next, we define the maximum width of an icon. This length will be stored in the `\cvHeaderIconWidth` macro using the following code:

{{< highlight latex >}}
\usepackage{calc}
\newlength\cvHeaderIconWidth
% we can only set this length after loading the fonts
\setlength{\cvHeaderIconWidth}{\maxof{\widthof{\faBriefcase}}{\widthof{\faGraduationCap}}}
{{< /highlight >}}

This way, we will always select the length of the widest icon.

To make the formatting of the sections easier, we are going to define a macro that handles this as well:

{{< highlight latex >}}
\newcommand{\cvSection}[1]{\Large\textbf{#1}}
{{< /highlight >}}

The final thing we need to add, are two new TikZ styles:

{{< highlight latex >}}
headerIcon/.style={
  minimum width=\headericonwidth,
  minimum width=\cvHeaderIconWidth,
  anchor=center,
  },
sectionTitle/.style={
  anchor=north west,
  align=left},
}
{{< /highlight >}}

### Basic Structure and Education Section 

Now it's finally time to add the very first thing to the main section. As a first section, we are going to add something about our education. Again, we are going to make use of a `tikzpicture` environment to easily align everything. The base layout looks as follows:

{{< highlight latex >}}
\begin{tikzpicture}[
  every node/.style={
    inner sep=0pt,
    outer sep=0pt
  },
  remember picture,
  overlay,
  shift={($(current page.north west)%
           +(\cvSideWidth+3\cvMargin+\cvTimeDotSep,-\cvMargin)$)}]
  % main content  
\end{tikzpicture}
{{< /highlight >}}

Using the global options, we are doing something very similar as in the sidebar for positioning. However, we do not want anything to overlap, so we need to add an offset by means of the `shift` key. Furthermore, we are also setting all the default margins TikZ adds around a node to zero.

To add the title of the first section, add the following code:

{{< highlight latex >}}
\node[sectionTitle] at (0,0) (title 1) {\cvSection{Education}};
\node[left=\cvTimeDotSep of title 1,headerIcon] {\faGraduationCap};
\begin{scope}[on background layer]
  \draw[line width=2pt,cvGreen] 
    let \p1=(title 1.south west), 
        \p2=(current page.east) in 
    (\x1,\y1-0.1cm) to (\x2,\y1-0.1cm);
\end{scope}
{{< /highlight >}}

The code is fairly straightforward. It adds _Education_ to the top of the page, draws a green line underneath and adds the education cap. To make sure the green line is not drawn over the text (not an issue here, but it might be in future sections), we need to draw it on the background layer by means of embedding it in the `scope` environment. The `let` syntax may be the most complex thing about this example.

`let` allows you to access the `x` and `y` values of a coordinate separately. This is done by first using the keyword `let` in combination with an assignment to the of the form `\p<tex atom>=(node name) in` and than allows access by means of `\x<tex atom>` and `\y<tex atom>`. A TeX atom is a single character or a set of characters surrounded by brackets (`{}`). Let's illustrate with an example: `\draw let \p{title 1}=(title 1) in (\x{title 1}, 0) circle (1cm);`. This will draw a circle with radius 1&nbsp;cm at the x-coordinate of the node with name `title 1`. 

Next, we need to define the distance between the different items of a single section inside (i.e. the spacing between two consecutive items in the education and experience sections). To this end, we define `\cvSectionSep`:

{{< highlight latex >}}
\newlength{\cvSectionSep}
\setlength{\cvSectionSep}{0.4cm}
{{< /highlight >}}

We are also going to define additional TikZ styles for ease of use and consistency:

{{< highlight latex >}}
eventdottext/.style = {
  text width=\cvMainWidth-\cvTimeDotSep,
  black,
  anchor=north west,
},
invisibletimedot/.style = {
  circle,
  minimum width=3pt,
  anchor=center
},
timedot/.style = {
  invisibletimedot,
  draw,
  fill,
  black,
},
{{< /highlight >}}

The styling itself is self-explanatory. They will be used for several different purposes. The `eventdottext` is the style for text attached to a certain event-dot. The styling for the dot itself is defined in `timedot`. This style makes use of `invisibletimedot` which is needed to correctly typeset the timeline.

To make formatting individual educations easily, we are also defining a special macro to typeset them.

{{< highlight latex >}}
\newcommand{\cvEducation}[3]{{\firaMedium #1}\\ #2\\ \emph{#3}}
{{< /highlight >}}

This macro takes three arguments: the name of the education, the period and  institution and a small description. The first argument will be typeset in a slightly bolder font (medium) and the final argument will be typeset in italics. 

Before we can use this slightly bolder typeface, we need to load it. The easiest way is to just create a new font family:

{{< highlight latex >}}
\newfontfamily\firaMedium{Fira Sans Medium}
{{< /highlight >}}

Now, we can finally start adding the different education entries to our timeline. This is done by first adding an invisible node which will be used to ensure spacing consistency. Then, we can add the actual text of the entry. Finally, we also add the dot to the timeline. Since this is the very first entry, we need to assign a label to it such that we can add the vertical line later on. 

{{< highlight latex >}}
\node[
  below=\cvSectionSep of title 1.south west,
  eventdottext] 
  (item 1 header) 
  {\phantom{Evening}};
\node[
  below=\cvSectionSep of title 1.south west,
  eventdottext] 
  (item 1) 
  {\cvEducation{Evening class: Chinese}%
               {Some School, City. September 2015 -- June 2016}%
               {Achieved A2 language skill in Chinese (Mandarin).}};
\node[
  left=\cvTimeDotSep of item 1 header,
  timedot] 
  (start) 
  {};
{{< /highlight >}}

The subsequent entries make use of very similar code:

{{< highlight latex >}}
% item 2
\node[
  below=\cvSectionSep of item 1.south west,
  eventdottext] 
  (item 2 header) 
  {\phantom{Evening}};
\node[
  below=\cvSectionSep of item 1.south west,
  eventdottext] 
  (item 2) 
  {\cvEducation{Bachelor of Science in Biochemistry and Biotechnology}%
               {University, City. September 2009 -- June 2012}%
               {General training in the basic sciences and the molecular life science.}};
\node[
  left=\cvTimeDotSep of item 2 header,
  timedot] 
  {};

% item 3
\node[
  below=\cvSectionSep of item 2.south west,
  eventdottext] 
  (item 3 header) 
  {\phantom{Evening}};
\node[
  below=\cvSectionSep of item 2.south west,
  eventdottext] 
  (item 3) 
  {\cvEducation{Master of Science in Biochemistry and Biotechnology}%
               {University, City. September 2012 -- June 2015}%
               {Applying theoretical knowledge from the bachelor in practical biochemistry and biotechnology applications. There is a strong emphasis on thorough, efficient and ethical reasoning and problem solving skills.}};
\node[
  left=\cvTimeDotSep of item 3 header,
  timedot] 
  {};
\node[
  left=\cvTimeDotSep of item 3.south west,
  invisibletimedot] 
  (end) 
  {};
{{< /highlight >}}

All of the above code adds the text and dots. Notice that we add an invisible dot after the final entry. This is needed to draw the actual timeline. Drawing the timeline is now easily done with the following code: 

{{< highlight latex >}}
\draw (start.center) to (end.center);
{{< /highlight >}}

This final line of code ends the education section. We can now move on to the experience and skills sections. 

### Typesetting Experiences

Next up is the experience section. This section uses exactly the same design as the education section. Minor modifications are needed though, so let's dive into the code.

Typesetting the title is now slightly more complicated, since we need to place it below the contents of the education section. The following code will typeset the title and line below it in exactly the same way as the education section.

{{< highlight latex >}}
\node[below=0.6cm of item 3.south west,sectionTitle] (title 2) {\cvSection{Experience}};
\node[left=\cvTimeDotSep of title 2,headerIcon] {\faBriefcase};
\node[below=0.6cm of item 3.south west,sectionTitle] (title 2 dummy) {\phantom{\cvSection{Education}}};
\begin{scope}[on background layer]
  \draw[line width=2pt,cvGreen] 
    let \p1=(title 2 dummy.south west), 
        \p2=(current page.east) in 
    (\x1,\y1-0.1cm) to (\x2,\y1-0.1cm);
\end{scope}
{{< /highlight >}}

Before we start adding the different items of the experience section, we are also going to define a macro to typeset the items consistently. The `\cvExperience` macro requires 5 arguments: a job title, company name, location, period and short description. 

{{< highlight latex >}}
\newcommand{\cvExperience}[5]{{\firaMedium #1}\\ \textsc{\selectfont #2}, #3. #4\\ \emph{#5}}
{{< /highlight >}}

We can now start typesetting the items in exaclty the same way as before. The snippet below adds three different job experiences to the CV.

{{< highlight latex >}}
\node[
  below=\cvSectionSep of title 2.south west,
  eventdottext] 
  (item 1 header) 
  {\phantom{Evening}};
\node[
  below=\cvSectionSep of title 2.south west,
  eventdottext] 
  (item 1) 
  {\cvExperience%
    {Student Job}%
    {Company X}%
    {Location X}%
    {Summer 2010}%
    {Integer tincidunt dapibus consectetur. Nullam tristique aliquam luctus. Sed ut ante velit. Nulla pharetra maximus lacus at elementum. Suspendisse sodales consectetur metus, sit amet ultricies ipsum ultrices ut.}};
\node[
  left=\cvTimeDotSep of item 1 header,
  timedot] 
  (start) 
  {};
  
% item 2
\node[
  below=\cvSectionSep of item 1.south west,
  eventdottext] 
  (item 2 header) 
  {\phantom{Evening}};
\node[
  below=\cvSectionSep of item 1.south west,
  eventdottext] 
  (item 2) 
  {\cvExperience%
    {Internship}%
    {Company Y}%
    {Location Y}%
    {June 2012 -- August 2012}%
    {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dictum cursus sapien, id eleifend mi pellentesque id. Etiam lobortis eu odio a sodales. Phasellus ut dolor feugiat, lacinia lectus in, blandit metus. Fusce lacinia dolor et metus gravida pulvinar sit amet et ex.}};
\node[
  left=\cvTimeDotSep of item 2 header,
  timedot] 
  {};
  
% item 3
\node[
  below=\cvSectionSep of item 2.south west,
  eventdottext] 
  (item 3 header) 
  {\phantom{Evening}};
\node[
  below=\cvSectionSep of item 2.south west,
  eventdottext] 
  (item 3) 
  {\cvExperience{Internship}%
      {Company Z}%
      {Location Z}%
      {August 2014 -- September 2014}%
      {Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dictum cursus sapien, id eleifend mi pellentesque id. Etiam lobortis eu odio a sodales. Phasellus ut dolor feugiat, lacinia lectus in, blandit metus.  Fusce lacinia dolor et metus gravida pulvinar sit amet et ex. Suspendisse vestibulum, leo malesuada molestie maximus, sem risus ornare elit, vitae sodales felis elit in ipsum.}};
\node[
  left=\cvTimeDotSep of item 3 header,
  timedot] 
  {};
\node[
  left=\cvTimeDotSep of item 3.south west,
  invisibletimedot] 
  (end) 
  {};
\draw (start) to (end.center);
{{< /highlight >}}

This wraps up the experiences section. Next up are skills.

### Typesetting Skills

To list our skills, we will create a list of items. A single column layout would waste precious space and not really fit the design. However, to make typesetting consistent, we need to include a TikZ library which is not shipped in the default distrubution. The `node-families` library allows us to set the same text depth in adjecent nodes without needing to explicitly code a value. It can be downloaded from [GitHub](https://github.com/Qrrbrbirlbel/pgf/blob/master/tikzlibrarynode-families.code.tex). Some notes can be found [here](https://tex.stackexchange.com/questions/107227/dependent-node-size-in-tikz).

We are also going to define a new macro to typeset the skill level easily. The `\cvSkill` macro takes one argument: a skill level and draws five circles which are filled in accordance to the skill level. To make this work, we need to use the following (rather involved) code:

{{< highlight latex >}}
\makeatletter
\newcount\my@repeat@count
\newcommand{\cvSkill}[1]{%
  \begingroup
  \my@repeat@count=\z@
  \@whilenum\my@repeat@count<#1\do{\faCircle\advance\my@repeat@count\@ne}%
  \my@repeat@count=\numexpr5-\z@\relax
  \@whilenum\my@repeat@count>#1\do{\faCircleO\advance\my@repeat@count\m@ne}%
  \endgroup
}
\makeatother
{{< /highlight >}}

This piece of code first defines a new counter that should normally never overlap with user counters (due to the usage of `@` in the name). Next, we start defining the macro. We wrap everything inside a logical group with `\begingroup` and `\endgroup`. We first set the counter to zero (`\z@`). Second, we draw the filled circle icon the requested number of times using a while-loop. Third, we initialise the counter to the value of 5 and add the remaining empty circles in the fourth and final step. Notice that the loop increases the counter value in the first while loop and decreases the value in the second while loop.

We can now start to typeset the skills section. This title design is exactly the same as before, so we get:

{{< highlight latex >}}
\node[below=0.6cm of item 3.south west,sectionTitle] (title 3) {\cvSection{Skills}};
\node[left=\cvTimeDotSep of title 3,headerIcon] {\faStar};
\node[below=0.6cm of item 3.south west,sectionTitle] (title 3 dummy) {\phantom{\cvSection{Education}}};
\begin{scope}[on background layer]
  \draw[line width=2pt,cvGreen] 
    let \p1=(title 3 dummy.south west), 
        \p2=(current page.east) in 
    (\x1,\y1-0.1cm) to (\x2,\y1-0.1cm);
\end{scope}
{{< /highlight >}}

The skills themselves are typeset in a matrix of nodes:

{{< highlight latex >}}
\matrix[matrix of nodes,
      below=0.6cm of title 3.south west,
      anchor=north west,
      column sep=6pt,
      row sep=6pt,
      every node/.style={Text Depth=tdSkills},
      column 1/.style={anchor=east,align=left},
      column 2/.style={anchor=west},
      column 3/.style={anchor=east,align=left},
      column 4/.style={anchor=west}] (skills) {
      \cvSkill{5} & MATLAB           & \cvSkill{5} & \LaTeX \\
      \cvSkill{4} & Python           & \cvSkill{4} & VHDL \\
      \cvSkill{4} & Microsoft Office & \cvSkill{4} & macOS \\
      \cvSkill{3} & C, C++           & \cvSkill{3} & Electrical Engineering \\
      \cvSkill{3} & HTML5/CSS        & \cvSkill{3} & Bash \\
      \cvSkill{3} & MPLAB~X          & \cvSkill{2} & Ruby on Rails \\
      \cvSkill{2} & ModelSim         & \cvSkill{1} & Javascript \\};
{{< /highlight >}}

### Typesetting References

The final section we are going to add to the main section is references. We will again create a two-column layout, similar to what we designed for the skills section.

For the title we get:

{{< highlight latex >}}
\node[below=0.6cm of item 3.south west,sectionTitle] (title 4) {\cvSection{References}};
\node[left=\cvTimeDotSep of title 4,headerIcon] {\faLink};
\node[below=0.6cm of item 4.south west,sectionTitle] (title 4 dummy) {\phantom{\cvSection{Education}}};
\begin{scope}[on background layer]
  \draw[line width=2pt,cvGreen] 
    let \p1=(title 4 dummy.south west), 
        \p2=(current page.east) in 
    (\x1,\y1-0.1cm) to (\x2,\y1-0.1cm);
\end{scope}
{{< /highlight >}}

And for the contents, we can do the following:

{{< highlight latex >}}
\matrix[matrix of nodes,
      below=0.6cm of title 4.south west,
      anchor=north west,
      column sep=6pt,
      row sep=6pt,
      every node/.style={Text Depth=tdRefs}] {
      Jane Smith           & \\
      Company ABC Co. Ltd. & \\
      Job title            & \\
      Street lane 2        & \\
      B-1150 Brussels      & \\
      +1 781 555 1212      & \\};
{{< /highlight >}}

This will only enable us to add two references. Additional references can easily be added by adding a new matrix of nodes at a distance of `\cvSectionSep` from the previous matrix.

## Conclusion

This waps up the main CV content. Due to the heavy usage of TikZ, we can easily align the different elements at the cost of having to manually break the pages, since a TikZ environment can also draw outside the current page, which is undesirable. In the next blog post, we will tackle the cover letter design. 

A preview of what we have already accomplished is depicted below:

{{< fig file="limecv_main.svg" id="cv-sidebar-main" class="centre-element max-500px-wide" alt="Sidebar and main content section." imgClass="frame">}}
