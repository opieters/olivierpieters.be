---
title: Information Security
support: math
exclude_from_search: true
---

> Information security, sometimes shortened to InfoSec, is the practice of defending information from unauthorised access, use, disclosure, disruption, modification, perusal, inspection, recording or destruction. It is a general term that can be used regardless of the form the data may take (e.g. electronic, physical). - [Wikipedia](https://en.wikipedia.org/wiki/Information_security)

## Basic Principles

The basic principles define which measures are taken to provide information security can usually be categorised in one (or more) of the following categories:

* Confidentiality: only people to whom the data is intended should be able to read it. This is typically achieved though an encryption function. Confidentiality might also refer to communicating entities (who communicates with whom?). Keeping this a secret is quite hard.
* Authentication: verifying that someone (something) really is who he (it) claims to be. Comparable to identification, but might also be applicable to attributes of someone (something).
* Access control: what is accessible for a certain entity?
* Data integrity: making sure the data was not altered _in any way_ in transit or during validity without knowledge of (communicating) entities.
* Non-repudiation: one cannot deny having received or transmitted a certain message.
* Availability: the system should be available (within its operating limits) when called upon.

## Complexity

When designing security for applications, it is important to take computational complexity into account. Not only do more and more of these systems run on embedded hardware (IoT), but the time and energy required for cryptographic operations can not be neglected. [Wikipedia](https://en.wikipedia.org/wiki/Computational_complexity_of_mathematical_operations) provides an overview of different asymptotical bounds that can be taken into account.

## Primes

A number {{< inline_math "p" >}} is prime if it can only be divided over the natural numbers by itself and {{< inline_math "1" >}}. Each number can thus be written as a unique product of (powers) of prime numbers:


{{< math >}}
a = \prod_{i=1}^k p_i^{\alpha_i}
{{< /math >}}

Two numbers are termed co-prime if the only common deviser is {{< inline_math "1" >}}:

{{< math >}}
\gcd{(a,b)} = 1
{{< /math >}}

## Modular Arithmetic

A good introduction to modular arithmetics can be found [here](https://en.wikipedia.org/wiki/Modular_arithmetic). Sometimes the [Chinese Remainder Theorem  (CRT)](https://en.wikipedia.org/wiki/Chinese_remainder_theorem) is also used in cryptography.

[Euler's totient function](https://en.wikipedia.org/wiki/Euler%27s_totient_function) {{< inline_math "\phi(n)" >}} returns the number of natural numbers strictly smaller than {{< inline_math "n" >}}
that are co-prime to {{< inline_math "n" >}}. For a prime {{< inline_math "p" >}}, we immediately obtain {{< inline_math "\phi(p) = p-1" >}}.

With the above definition, we can state Euler's theorem:

{{< math >}}
a^{\phi(n) = 1} \mod n
{{< /math >}}

with {{< inline_math "a" >}} and {{< inline_math "n" >}} co-prime. If {{< inline_math "n" >}} is a prime number, this is usually called the Fermat theorem. This can even be extended to products of primes {{< inline_math "n=pq" >}} with {{< inline_math "p" >}} and {{< inline_math "q" >}} prime:

{{< math >}}
a^{\phi(n)+1} = a^{(p-1)(q-1)} = a \mod n
{{< /math >}}

with _no_ restrictions on the values for {{< inline_math "a" >}}. The above forms the basis for RSA.

But how do we test  for primality? This is usually done with the Miller-Ramin and Solovay-Strassen primality test. These are probabilistic test, because deterministic tests typically require far to much computation power to be practically feasible.

Suppose we define a base {{< inline_math "a" >}} (generator in the modular ring defined by {{< inline_math "n" >}}), than we can define the discrete logarithm with respect to this base:

{{< math >}}
\forall x \in \mathbb{N}_n: \exists y \in [0,\phi(n)]: x = a^y \mod n \Rightarrow y = \log_a(x) \mod n
{{< /math >}}

Solving the above discrete logarithm proves to be _very hard_ if the factorisation of {{< inline_math "n" >}} is unknown (for traditional algorithms). This forms the basis for Deffie-Hellman-like cryptographic systems. However, if the quantum computer works some day, there exists a quantum algorithm that is able to solve the factorisation problem in polynomial time ({{< inline_math "O(3b)" >}}) with {{< inline_math "b" >}} the number of bits. This algorithm is called the Shor's algorithm.

## Elliptic Curves

A completely different encryption technique uses elliptic curves. Elliptic curves are very different from RSA based encryption techniques which have the disadvantage of large key sizes. Keys on elliptic curves are typically an order of magnitude smaller, making them attractive alternatives for RSA, especially in embedded systems. Techniques using elliptic curves are usually grouped in under the name Elliptic Curve Cryptography (ECC).

Elliptic curves always have the following form:

{{< math >}}
y^2 + axy + by = x^3 +cx^2 + dx + e
{{< /math >}}

but they are usually simplified to:

{{< math >}}
y^2 x^3 + ax + b
{{< /math >}}

They can be defined over the real numbers and over integer numbers. The integer number variant is of course the more interesting one for cryptographic applications.
