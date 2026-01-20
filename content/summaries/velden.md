---
title: Velden
support: math
output: false
exclude_from_search: true
---

Deze pagina bevat een overzicht van de leerstof uit de tweede bachelor burgerlijk ingenieur omtrent velden.

## Scalair veld

Nabla, een differentiaaloperator van de eerste orde

$$\def\nablav{\overrightarrow{\nabla}}
\newcommand{\v}[1]{\overrightarrow{#1}}
\newcommand{\abs}[1]{\left|#1\right|}
\nablav = (\partial_x, \partial_y, \partial_x)$$

## Vectorveld

## Richtingsafgeleide van een scalair veld

$$\partial_\v{u} f(P) = \v{u}\cdot\nablav f(P)$$

$\partial_\v{u} f(P)$ is extremaal als $u$ de richting van $\nablav f(P)$ bezit; maximaal als $u$ ook de zin van $\nablav f(P)$ heeft, minimaal als  tegengesteld aan  georiënteerd is.

$\nablav f$ is een vectorveld met als functiewaarde in elk punt $P$ een vector die:
•	De oppervlaknomaal is in het beschouwde punt
•	Zijn oriëntatie heeft in de zin van de toenemende functiewaarden
•	De grootte

$$\abs{\partial_\v{u} f(P)} = \lim_{h \rightarrow 0} \dfrac{1}{h} \left( f(P+h\v{u}) - f(P) \right)$$

## Divergentie van een vectorveld
Definitie divergentie:

$$\nablav\cdot\v{F}$$

$\v{F}$ is divergentievrij indien:

$$\nablav\cdot\v{F} = \v{0}$$

De divergentie van het gradiëntveld van $F–\nablav f$ is: $\nabla\cdot\nabla f = \Delta f$. Dit noemen we de laplaciaan. Merk op dat we veronderstellen dat de functie  op zijn minst twee maal continu differentieerbaar is!

$$\Delta = \nablav\cdot\nablav = \nablav^2$$

Voor een harmonische functie  geldt er:

$$\Delta f = 0$$

Rotatie van een vectorveld

Definitie rotatie:

$$\nablav\times \v{F} =
\begin{vmatrix}
\v{e_1} & v{e_2} & v{e_3} \\
f_1     & f_2    & f_2 \\
\partial_x & \partial_y & \partial_z
\end{vmatrix}$$

Opgelet: dit begrip is gebiedsafhankelijk!
Veronderstel dat $f \in \mathcal{C}^2$, dan is de rotatie van de gradiënt nul:

$$\nablav\times\nablav f = \v{0}$$

Definitie rotatievrij:

$$\nablav\times\v{F} = \v{0}$$

## Conservatieve vectorvelden
Samenhangend gebied: tussen elk koppel punten bestaat er een kromme, die volledig tot het gebied behoort.

Enkelvoudig samenhangend gebied: dit gebied is samenhangend en elke kromme kan op continue wijze ineenkrimpen tot een punt, zonder het gebied te verlaten.

Definitie conservatief vectorveld

Een vectorveld $\v{F}$ in een open, samenhangend gebied $\Omega$ noemt men conservatief als het continu is in $\Omega$ en als er in  een continu differentieerbaar scalair veld $\phi$ bestaat waarvan het gradiëntveld precies $\v{F}$ is.

$$\nablav\phi = \v{F}$$

Stelling

Als een continu differentieerbaar vectorveld conservatief is in een open, samenhangend gebied, dan is het rotatievrij.

Als het vectorveld  continu differentieerbaar en rotatievrij is in het open, _enkelvoudig_ samenhangend gebied $\Omega$, dan is $\v{F}$ conservatief in $\Omega$.

## Solenoïdale vectorvelden

Definitie solenoïdale vectorvelden

Een vectorveld $\v{F}$ in een open, samenhangend gebied $\Omega$ noemt men solenoïdaal als het continu is in $\Omega$ en als er in $\Omega$ een continu differentieerbaar vectorveld $\v{A}$ bestaat waarvan de rotatie precies is:

$$\nablav\times\v{A} = \v{F}$$

$\v{A}$ heet de vectorpotentiaal.

Stelling

Als een continu differentieerbaar vectorveld solenoïdaal is in een open, samenhangend gebied, dan is het divergentievrij.

Als een vectorveld  continu differentieerbaar is en divergentievrij is in een open interval , dan is  er solenoïdaal.

Handig: de divergentie van de rotatie is nul:

$$\nablav\cdot(\nablav\times\v{A}) = 0$$

## De helmholtzontbinding van vectorvelden
Indien $F$ noch divergentievrij, noch rotatievrij is in $\Omega$, dan kan $F$ ontbonden worden volgens de helmholzontbinding:

$$\v{F} = \nablav\phi + \nabla\times\v{A},\qquad \nablav\cdot\v{A} = 0$$

Deze ontbinding is NIET uniek! Het scalaire veld $\phi$ is op een harmonische scalair na bepaald en de vectorpotentiaal op een gradiënt van een harmonisch scalair na.

Veronderstel dat we werken in een open interval $\Omega$.

### Stap 1: scalaire veld opstellen
Neem de divergentie van $F$ (de Poissonvergelijking):

$$\nablav\cdot\v{F} = \nablav\cdot\nablav\phi = \Delta\phi$$

Één maal partiële integratie toepassen levert de gezochte functie: $\nablav\phi$
### Stap 2: vectorpotentiaal bepalen

$$\v{G} = \v{F} - \nablav\phi$$

$\v{G}$ divergentievrij? Ja!
Een stelling verzekert ons nu het bestaan van de vectorpotentiaal voor het vectorveld . We bepalen het nu via geziene technieken.

Is $A$ divergentievrij? Neen, in het algemeen niet… maar $A$ is op een gradiëntveld na bepaald, neem dus:

$$\v{A^*} = \v{A} + \nablav f \\
\nablav\cdot\v{A^*} = \nablav\cdot\v{A} + \Delta f
$$

Hieruit volgt een bepaalde , die dus moet voldoen aan:

$$\Delta f = -\nablav\v{A}$$

Nu is $\v{A}$ wel divergentievrij.

## Divergentie- en rotatievrije vectorvelden
Het rieszstelsel: beschouw in $\Omega$ (open)

$$
\nablav\cdot\v{F} = 0 \\
\nablav\times\v{F} = \v{0}
$$

Bij gevolg is $\v{F}$ conservatief EN solenoïdaal. Het hiermee corresponderende scalair potentiaalveld $\phi$ en vectorpotentiaal $\v{A}$ is dus harmonisch.

We kunnen zelfs stellen dat $\v{F}$ een harmonisch scalair veld is in $\Omega$. Dus $\v{F}$ is onbeperkt continu afleidbaar in $\Omega$.

We beperken ons tot een vlakke $\v{F}$, gelegen in het $xy$-vlak.

Het Cauchy-Riemannstelsel:

$$
\partial_x f_1 + \partial_y f_2 = 0 \\
\partial_x f_2 - partial_y f_1 = 0 \\
\Rightarrow f := f_1(x,y) - i f_2(x,y)
$$

We voeren de Cauchy-Riemannoperator in:

$$
\bar{\partial} = \dfrac{1}{2}(\partial_x+i\partial_y)\\
\bar{\partial}f = 0
$$

Een functie ie hieraan voldoet noemt men holomorf of analytisch in $\Omega$.

Overige gevolgen en opmerkingen eens bekijken in de cursus.

## Nabla-rekening

Pagina 47 staan enkele basisformules opgelijst. Deze kunnen handig zijn bij het oplossen van oefeningen, belangrijk is niet deze allemaal te memoriseren, maar een grondige kennis te verwerven van hun afleiding.
