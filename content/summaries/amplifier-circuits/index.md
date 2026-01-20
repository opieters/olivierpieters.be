---
title: Amplifier Circuits and Applications
support: math
exclude_from_search: true
---

As discusses in the [amplifiers summary]({{< ref "/summaries/amplifiers/index.md" >}}), amplifiers typically have very large amplification. This large factor is usually several orders of magnitude to large to use directly, we must also consider stability over time of this amplification. This is why one typically uses amplifiers in a feedback network. Several popular configurations exist for different application, as will be discussed in the subsequent sections.

## Feedback

A simple feedback circuit is depicted in the figure below. It is obvious a fraction (determined by the voltage divider) of the output voltage {{< inline_math "v_o" >}} is fed back to the negative input pin. This will allow us to set a desired amplification level. Important to keep in mind is stability! A feedback network will in general not be stable, so we will need to verify if the circuit is stable in its operating region.

{{< fig file="amplifier-feedback-circuit.svg" alt="non-inverting-amplifier" class="max-400px-wide" caption="Non-inverting amplifier"  >}}

Typically, a feedback network can be reduced to the following block diagram, where a fraction {{< inline_math "\beta" >}} of the output {{< inline_math "y" >}} is fed back to the input. The error voltage {{< inline_math "e = x - y" >}} will determine the output.

{{< fig file="amplifier-feedback-block-diagram.svg" alt="general-block-diagram" class="max-400px-wide" caption="General feedback block diagram"  >}}

A quick analysis from the electrical circuit, learns us that the feedback factor of that circuit is:

{{< math >}}
\beta = \dfrac{R_1}{R_1+R_2}
{{< /math >}}

In the case of an ideal amplifier, we have {{< inline_math "A=\infty" >}} and we can apply the nullator hypothesis provided the circuit is stable: {{< inline_math "\epsilon=V_+-V_-0" >}}. This makes quick analysis easy for this type of circuits. We immediately find:

{{< math >}}
\begin{aligned}
\beta v_o=V_-\approx V_+=e \\
\Rightarrow v_o \approx \dfrac{1}{\beta}e
\end{aligned}
{{< /math >}}

If we do not apply this hypothesis, we obtain:

{{< math >}}
v_o = \dfrac{A}{1+\beta A}e \approx \dfrac{1}{\beta}e
{{< /math >}}

This is valid because the direct amplification is typically very large ({{< inline_math "A\ll 1" >}}) and the attenuation not too large: {{< inline_math "\beta A \ll 1" >}}.

### Loop Gain

The size of the product {{< inline_math "\beta A" >}} is a very important factor in the application of the nullator hypothesis. The product {{< inline_math "\beta A" >}} is usually called the loop gain ({{< inline_math "LG" >}}), since it equals the amount of gain the signal receives every loop. This can be easily verified by cutting the block diagram open at point A and setting the input zero.

Applying the same reasoning to circuits does not work in general, because the output of a certain block is dependent on the input impedance of the subsequent block. This makes the circuit analysis in terms of building block more involved. We generally need to represent the other blocks in terms of an equivalent circuit such that all voltages and current remain unchanged.

The correct approach is illustrated by these figures:

{{< fig file="equivalent-start.svg" alt="loop-gain-complete" class="max-400px-wide" caption="A general circuit concatenation"  >}}

{{< fig file="equivalent-blocks.svg" alt="loop-gain-split" class="max-400px-wide" caption="A series concatenation of a general circuit for easier analysis"  >}}

In general, we can state the following ({{< inline_math "H(A=\infty)" >}} is the transfer function in case of infinite amplification, i.e. nullator hypothesis) if the output of the circuit is taken at the amplifier output:

{{< math >}}
H = \dfrac{e}{v_o} = H(A=\infty)\dfrac{LG}{1+LG}
{{< /math >}}

### Voltage &amp; Current Feedback

Feedback can be either of the voltage or current type. This depends on the signals considered as in- and output and on the load. If the proportionality factor of the voltage feedback is independent of the (external) load, we have a circuit which exhibits voltage feedback.

Knowing the difference between both is useful (if the loop gain is sufficiently large). If we have voltage feedback, we can consider the output for the amplifier as a voltage source. This is because the amount of feedback does not change, independent of the load. Thus, the controller (created by adding feedback) provides a constant quantity that is fed back to the input.

The output resistance of the circuit (depicted above) is:

{{< math >}}
Z_\text{out} = (R_1+R_2)\parallel \left(\dfrac{r}{1+LG}\right)
{{< /math >}}

Here, {{< inline_math "r" >}} is the output impedance of the op amp itself, which is assumed to be a voltage source. This confirms the previous statement that the output resistance of an amplifier must be low in order for it to operate as a voltage source.

### Dynamic Effect of Feedback

The dynamic behaviour the the amplifier is described by {{< inline_math "A(s)" >}}:

{{< math >}}  
A(s) = \dfrac{A_0}{1+\dfrac{s}{\omega_0}}
{{< /math >}}

This results in an overall transfer function {{< inline_math "H(s)" >}} (with feedback, {{< inline_math "\mathcal{L}" >}} is the Laplace transform):

{{< math >}}  
H(s) = \dfrac{\mathcal{L}(v_o)}{\mathcal{L}(e)} = \dfrac{A(s)}{1+\beta A(s)} = \dfrac{A_0\omega_0}{\omega_0(1+\beta A_0)+s} = \dfrac{H_0}{1+\dfrac{s}{H_0}}
{{< /math >}}

This transfer function has a cutoff pulsation {{< inline_math "\omega_\text{3dB}" >}} that is: {{< inline_math "\omega_0(1+\beta A_0)\ll\omega_0" >}}, we have not only improved the gain stability but also the speed of the amplification since this cutoff pulsation is much larger than the original.

One interesting fact is that the gain bandwidth product (GBP) remains constant:

{{< math >}}
H_0\omega_\text{3dB} = A_0 \omega_0
{{< /math >}}

### Non-Linearity (Distortion)

The influence of distortion can be investigated in several ways. The easiest is depicted below. We suppose a linear amplifier, and _add_ the distortion by means of the sum and {{< inline_math "\Delta" >}}.

{{< fig file="feedback-distortion.svg" alt="distortion" class="max-400px-wide" caption="Investigating the effect of feedback on amplifier distortion (non-linearity)"  >}}

The effect on the output is very low because of the feedback:

{{< math >}}  
y = \dfrac{A}{1+LG}x + \dfrac{1}{1+LG}\Delta \approx \dfrac{A}{1+LG}x
{{< /math >}}

### Stability

When designing amplifier circuits, it is very important to study the stability conditions of the circuit. Otherwise, a transient phenomenon will not die out and oscillation can occur. This is usually not intended and most be avoided by means of good design and analysis.

The stability of the transfer function {{< inline_math "H(s)" >}} (in its general form) is:

{{< math >}}  
H(s) = \dfrac{A(s)}{1+\beta A(s)}
{{< /math >}}

The stability of this transfer function is only determined by the poles of the denominator: {{< inline_math "1+\beta A(s)" >}}. These are usually investigated by meand of the root locus technique. We can then check if the Nyqiust stability criterion (simplified version) holds:

The system is stable provided the close loop Nyquist contour does not enclose the point {{< inline_math "(-1,0)" >}} in the Nyquist diagram.

For stability reasons, it is very important not to neglect parasitic capacitance, since these capacitors introduce additional phase shifts (and poles), resulting in an increased possibility of instability.

## Applications

{{< fig file="amplifier-inverting.svg" alt="inverting-amplifier" class="max-400px-wide" caption="Inverting amplifier" >}}

{{< fig file="amplifier-sum.svg" alt="signal-sum-amplifier" class="max-400px-wide" caption="Signal sum amplifier"  >}}

{{< fig file="amplifier-transimpedance.svg" alt="transimpedance-amplifier" class="max-400px-wide" caption="Transimpedance amplifier" >}}

{{< fig file="amplifier-difference.svg" alt="instrumentation-amplifier" class="max-400px-wide" caption="Instrumentation amplifier" >}}

{{< fig file="amplifier-feedback-circuit.svg" alt="non-inverting-amplifier-2" class="max-400px-wide" caption="Non-inverting amplifier" >}}

{{< fig file="amplifier-differentiator.svg" alt="differentiator" class="max-400px-wide" caption="Differentiator" >}}

{{< fig file="amplifier-difference.svg" alt="integrator" class="max-400px-wide" caption="Integrator"  >}}

{{< fig file="amplifier-buffer.svg" alt="buffer" class="max-400px-wide" caption="Buffer"  >}}

{{< fig file="amplifier-schmitt-trigger.svg" alt="schmitt-trigger" class="max-400px-wide" caption="Schmitt trigger" >}}
