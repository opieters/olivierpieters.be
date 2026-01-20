---
title: Oppervlakintegralen
support: math
exclude_from_search: true
---

Deze pagina bevat een overzicht van de leerstof uit de tweede bachelor burgerlijk ingenieur omtrent oppervlakintegralen.

## Oppervlakintegralen van een scalair veld

$$
\def\nablav{\overrightarrow{\nabla}}
\newcommand{\v}[1]{\overrightarrow{#1}}
\newcommand{\abs}[1]{\left|#1\right|}
\newcommand{\br}[1]{\left(#1\right)}
S: P(u,v), (u,v) \in D \\
\int_S \phi d\sigma = \int_D \phi(P(u,v))\norm{v{\partial_u P} \times v{\partial_v}P} du dv
$$

## Oppervlakintegraal van een vectorveld

$$ \int_S \v{F}\cdot d\sigma = \int_D v{F}\cdot \br{v{\partial_u P} \times v{\partial_v}P} du dv

## De divergentiestelling

Stelling (divergentiestelling)
Als $G$ continu differntieerbaar is in het open gebied $\Omega$, en $V$ is een normaalgebied (of unie van normaalgebieden) in $\Omega$, dan is

$$\int_{\partial V} \v{G} \cdot \v{n}^u d\sigma = \int_V \nablav\cdot\v{G} dV$$

waarbij $\v{n}^u$ de eenheidsvector langs de oppervlaknormaal aan $\partial V$ die uitwendig gericht is, voorstelt.

Opmerking
Naar aanleiding van de fysische betekenis die we aan deze integraal kunnen koppelen (de flux) spreken we over $\nablav\cdot\v{F}=0$ als bronvrij (aangezien de hoeveelheid instroom gelijk is aan de hoeveelheid uitstroom van vloeistof).


## Aanvullende formules bij de divergentiestelling

Als $\v{G} = \nablav\phi$, dan:

$$\v{G}\cdot\v{n}^u = \nablav\phi\cdot\v{n}^u = \partial_{v{n}^u}\phi \rightarrow \int_{\partial V} \partial_{v{n}^u}\phi d\sigma = \int_V \Delta\phi dV$$

Als \v{G} = \xi\nablav\phi, dan:

$$\nablav\cdot\v{G} = \nabla\xi\cdot\nabla\phi + \xi\Delta\phi$$

***aanvullen***

## Stelling van Stokes

Stelling (Stokes)
Als $\v{F}$ continu differentieerbaar is in een open $\Omega$ en $S$ is een glad oppervlak dat bevat is in $\Omega$ en dat projecteerbaar is op één van de coördinaatassen (of een unie van projecteerbare oppenvlakken), dan geldt:

$$\int_{\partial S}\v{F}\cdot\v{dP} = \int_S\br{\nablav\times\v{F}}\cdot\v{n}^k d\sigma$$

met $\v{n}^k$ de eenheidsvector lans de oppervlaknormaal aan $S$, zodanig dat de zin van $\v{n}^k$ overeenstemt met de doorloopzin van $\partial S$ volgens de kurkentrekkerregel.

Opmerking
De stelling van Stokes stelt dat de oplossing van de rechtse integraal niet afhangt van de vorm van het oppervlak, enkel van de vorm van de rand.

## Synthese
Divergentiestelling  - alternatieve formuleringen. Er wordt verondersteld dan $V$ aan de vereiste voorwaarden van de stelling voldoet.

divergentie
$$\int_{\partial V}\v{G}\cdot\v{n}^u d\sigma = \int_V \nablav\cdot\v{G}dV$$

rotatie
$$\int_V \nablaV\times\v{F}dV = \int_{\partial V}\v{n}^u\times\v{F}d\sigma$$

gradiënt
$$\int_V \nablav\phi dV = \int_{\partial V}\phi \v{n}^u d\sigma$$


Stelling van Stokes - alternatieve formuleringen. Er wordt verondersteld dan  aan de vereiste voorwaarden van de stelling voldoet.
***aanvullen***

scalaire product
$$\int_{\partial S}\v{F}\cdot\v{dP} = \int_S \br{\nablav\times\v{F}}\cdot\v{n}^k$$

rotatie
$$\int_V \nablav\times\v{F} dV = \int_{\partial V}v{n}^u$\times\v{F} d\sigma$$

gradiënt
$$\int_V \nablav\phi dV = \int_{\partial V}\phi \v{n}^u d\sigma$$

Oefeningen
Ruimtehoek is de oppervlakte van , de orthogonale projectie t.o.v. de oorsprong van een oppervlak  op de eenheidssfeer,
