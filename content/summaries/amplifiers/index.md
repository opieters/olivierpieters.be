---
title: Amplifiers
support: math
excerpt_separator: <!--more-->
exclude_from_search: true
---

Analogue amplifiers usually amplify the voltage difference between their input pins to the output (differential amplifier). Their characteristic equation is simply:

<div class="math">
v_{out} = A v_{in}
</div>

<!--more-->

The input should thus have a high impedance (no current enters the amplifier pins) and the output a low impedance (the output voltage should be independent of the load impedance).

Characteristics of good amplifiers are:

* very high amplification (order of 100 dB)
* saturation near the voltage supply level and not at much lower voltages
* low distortion

Low distortion is important to be able to apply the linear approximation of this active element. All active elements show non-linearity (saturation for example) to some degree. The distortion is usually characterised by means of the _Total Harmonic Distortion_:

<div class="math">
THD = \dfrac{\sqrt{\sum_{n=2}^\infty U_n^2}}{U_{eff}}\approx\dfrac{\sqrt{\sum_{n=2}^\infty U_n^2}}{U_1}, \quad U_i = i\text{-th Fourier coefficient}
</div>

To suppress external noise and interefer sources, circuits are usually designed to be symmetric. Homopolar components will then be rejected by the differential amplifier, leading to better signal integrity.

## Common Mode Rejection Ratio (CMRR)

Assume the amplification for the two input pins is unequal, then we obtain:

<div class="math">
v_{out} = A_1 v_1 - A_2 v_2
</div>

This can be rewritten as a sum of a common mode and differential component:

<div class="math">
v_{out} = A_d V_d + A_h V_h,\quad A_h = A_1 - A_2, A_d = \dfrac{A_1+A_2}{2}
</div>

Ideally, <span class="inline_math">A_1=A_2</span> and we obtain only differential amplification. Characterisation of the common mode amplification is usually done by means of the CMRR:

<div class="math">
CMRR = 20 \log\dfrac{A_d}{A_h}
</div>

## Input Voltage Offset

In real amplifiers, there is usually a non-zero output voltage even though the input voltages are both grounded. This is due to the input voltage offset. Usually this non-ideality is modelled by adding an additional voltages source, as is depicted below:

{{< fig file="amplifier-input-voltage-offset.svg" alt="amplifier-input-voltage-offset" class="max-400px-wide" caption="Input offset voltage." >}}

One could argue that this offset <span class="inline_math">v_{os}</span> can be cancelled out by adding an additional voltage source in the other direction in series after measuring the output voltage. This is only partially true because the offset voltage will usually drift (change) over time and due to environmental (e.g. temperature) and supply voltage changes.

The change due to the supply voltage (<span class="inline_math">V_{BB}</span>) is usually specified by means of the _Power Supply Rejection_:

<div class="math">
PSR = \dfrac{\Delta v_{os}}{\Delta V_{BB}}
</div>

## Output impedance

Real amplifiers have an output impedance that is larger than zero. As a consequence, the output voltage will depend on the load impedance (and thus also output current). This is usually modelled by adding a resistor in the circuit with an ideal amplifier.

## Input Bias Current

Analogous to the output impedance, is the input impedance also not ideal (and thus smaller than infinity). This will result in a non-zero input current that can differ for both input pins. These currents are dependent on the input voltage. We can split these input impedances in a common mode and differential component. The common mode components should be very large (1GΩ and larger), while the differential component is smaller (100kΩ to 100MΩ).

Another effect is to non-zero bias current needed for BIP transistors (those with FETs have extremely small input currents that can usually be neglected). These will usually be stable in time, because the amplifier's biassing is usually fixed.

## Limited Switching Speed: Introducing Simple Transfer Functions

All of the above effects were static effects that did not take into account the dynamics of the amplifier (e.g. parasitic capacitors). The amplifier will keep on amplifying (in the ideal model), even if the input voltage has an infinite (very large) frequency. This will not occur in reality, nothing can go infinity fast. A good first order approximation can be achieved through by modelling the amplification as a first order transfer function:

<div class="math">
A(s) = \dfrac{A_0}{1+s\tau}
</div>

The input impedances usually have a parasitic capacitive as well, which can also be modelled by means of a first order transfer function.

## Slew Rate

An amplifier is bandwidth limited. This means that the rate at which the output voltage can vary is limited. This limit is named the _slew rate_ (<span class="inline_math">SR</span>):

<div class="math">
\left|\dfrac{\mathrm{d}v_{out}}{\mathrm{d}t}\right| \le SR
</div>

## Noise

Active devices generate noise, the amplifier does so too. This is usually modelled by adding two parallel current sources (one at each input pin) and a voltage source in series with one pin. It is usually assumed these sources are uncorrelated. They usually can be modelled by the same stochastic process.

## Related Components

### Symmetrical Output Amplifier

The amplifier model used in the above discussion has a single output pin. Two output pins are also common, both pins having the same magnitude bot opposite sign. This allows to build fully differential circuits which are more immune to noise and external influences.

### Comparator

An amplifier with even higher amplification <span class="inline_math">A_0</span> (saturates quickly). Can be used with and without feedback.

### Schmitt-Trigger

A comparator with hysteresis.

[Input Voltage Offset]: 
