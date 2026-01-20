---
title: Lineaire algebra basis
support: math
exclude_from_search: true
---

Deze pagina bevat een overzicht van de leerstof uit de eerste bachelor burgerlijk ingenieur omtrent lineaire algebra.

## Lineaire ruimten

### Definities en voorbeelden
$(V,+,\cdot)$ is een vectorruimte als volgende voorwaarden vervuld zijn:

1. $(V,+)$ is een abelse groep ($e_+$, $e^{-1}$, associativeit, distributiviteit)
2. Vermenigvuldiging met scalairen is distributief t.o.v. $+$, associativiteit,
3. $(\mathbb{F},+,\cdot)$ is een veld: $(\mathbb{F},+)$ is abelse groep en $(\mathbb{F}\backslash e_+,\cdot)$ is abelse groep.

$W \prec V$ als volgende eigenschap geldt: $\forall v,w\in W: v+w\in W$ en $\lambda \in W, \forall v \in \mathbb{F}$ of $\forall v,w \in W$ en $\forall \lambda,\mu \in \mathbb{F}: \lambda v + \mu w \in W$.

### Deelruimten van een lineaire ruimte
Volgende men zegt dat **lineair afhankelijk** is als $v$ geschreven van $$v_i$$ kan worden als:

$$ v = \sum_{i=1}^n \lambda_i v_i, \qquad \lambda \in \mathbb{F} $$

Men zegt ook dat  een lineaire combinatie is van .

Stelling 1.2.1:
Zij  een lineaire ruimte over  en  een willekeurige deelverzameling ervan, dan geldt:

1. $\text{span}_{\mathbb{F}}(S) \prec V$
2. $\text{span}_{\mathbb{F}}(S)$ is de kleinste deelruimte die $S$ omvat

### Basis en dimensie van een lineaire ruimte
Zij $V$ een lineaire ruimte over $\mathbb{F}$ en $S$ een voortbrengend deel van $V$, dan wordt $S$ een voortbrengende verzameling voor $V$ of een voortbrengend deel van $V$ genoemd als $\text{span}_{\mathbb{F}}(S) = V$.

Zij $V$ een lineaire ruimte over $\mathbb{F}$. Een eindig stel vectoren $\{v_1,\ldots,v_m\}$ wordt lineair afhankelijk of vrij genoemd als, met $\lambda_j \in \mathbb{F}, j=1,\ldots, m$ er geldt dat uit:

$$ \sum_{j=1}^m \lambda_j v_j = 0$$

volgt dat $\lambda_j = 0, j=1,\ldots,m$.

Stelling 1.3.1 vrij deel
Zij $V$ een lineaire ruimte over $\mathbb{F}$. Een verzameling $S$ is een vrij deel van $V$ als en slechts dan als elke vector in $\text{span}_{\mathbb{F}}(S)$ op unieke wijze kan worden geschreven als lineaire combinatie van vectoren uit $S$.

Stelling 1.3.2
Zij $V$ een lineaire ruimte over $\mathbb{F}$ en $S$ een vrij deel van $V$, waarvoor geldt dat $W=V\backslash\text{span}_{\mathbb{F}}(S)$ niet-ledig is. Dan is $\forall w \in W $ de verzameling $S\cup \{w\}$ enveeens een vrij deel van $V$.

Stelling 1.3.3
Zij $V$ een lineaire ruimte over $\mathbb{F}$ en $S=\{ v_1,\ldots,v_n \}$ een voortbrengend deel van $V$, dan bevat elk vrij deel van $V$ hoogstens $n$ elementen.

Definitie basis

We noemen  een basis als $\mathcal{B}$ vrij is en $\text{span}_{\mathbb{F}}(\mathcal{B}) = V$. De dimensie van een basis ($\text{dim}(\mathcal{B})$) is het aantal elementen in $\mathcal{B}$.

Equivalente uitspraak:
Zij $S$ een deelverzameling van $V$ en $\text{dim}(V)=n=\# S$, dan geldt: $S$ is vrij   als en slechts dan als $S$ voortbrengd is.

### Coördinatisering
Door een basis te ordenen ontstaat elk element door unieke lineaire combinatie van elementen. Deze kunnen we via een isomorfisme op $\mathbb{F}^n$, op $\mathcal{F}^{n\times1}$ of op $\mathcal{F}^{1\times n}$ afbeelden.


### Bewerkingen met deelruimten
Geldt er: $V_1, V_2 \prec V$, dan $V_1 \cap V_2$ een deelruimte van $V$.

Definitie (directe) som deelruimten
Zij $V$ een vectorruimte over $\mathcal{F}$ en $V_1, V_2 \prec V$ dan is de som, $V_1+V_2$ van deze twee deelruimten:

$$ V_1+V_2 := \{ v_1 + v_2 | v_i \in V_i, i=1,2\} = \text{span}_{\mathbb{F}}(V_1+\cup V_2)$$

Speciaal geval: geldt er: $V_1\cap V_2 = \{0\}$, dan noemt met $V$ de directe som van  $V_1$ en $V_2$: $V = V_1 \oplus V_2$

$$ \text{span}_{\mathbb{F}}(A \cup B) = \text{span}_{\mathbb{F}}(A) + \text{span}_{\mathbb{F}}(B) $$

Stelling 1.5.1 Dimensiestelling

$$ \text{dim}(V_1+V_2) = \text{dim}(V_1) + \text{dim}(V_2) - \text{dim}(V_1\cap V_2)$$

$$ \text{dim}(V_1 \oplus V_2) = \text{dim}(V_1) + \text{dim}(V_2) $$
