---
title:    "MATLAB Scripting and LaTeX"
draft:    false
date:     "2015-10-30T09:34:41+01:00"
tags:     [LaTeX, MATLAB, scripting, pgfplots]
category: LaTeX
---

{{< blank_url "MATLAB" "http://mathworks.com" >}} is a powerful environment for numerical computations. Consequently, it is often used in academia and industry to quickly perform simulations, test models, perform matrix computations and visualize data. It provides toolboxes for signal processing, neural networks, curve fitting and so on.
<!--more-->

Because MATLAB is such an easy to use and powerful tool, it is no surprise we want to use it for data processing and then export our data for plotting in LaTeX. This way, we do not need to hard code values in our `pgfplots` plots (a boring and cumbersome task). It is very easy to import and export data in CSV-form in MATLAB and LaTeX. We will use the CSV-format because it is very easy to use. By using an intermediate format to save our data, we can make our LaTeX plot dynamic. If our raw data changes (more measurement points, wrong measurements), the values _automatically_ change in LaTeX after running our script.

This is not a tutorial to the MATLAB environment or programming language. Readers are supposed to have basic understanding of MATLAB and LaTeX.
{:.remark}

We will now illustrate how we can import data into MATLAB, process it and export it again for plotting in `pgfplots` (LaTeX). The entire thought process behind the experiment is discussed below.

## Collect the Data

The first and by far most important step is the data collection. Good data is fundamental in research and without it, you cannot draw good conclusions nor have a good plot, even if the plots are good on the eye. So first of all, we need to spend time collecting correct data and save it in a consistent and structured way. In the following, we always assume data is saved in the CSV-format. Individual values are separated by a comma and the rest is just plain ASCII-text. These files are easily read by different programs and can be accessed (and manipulated) with a plain text editor such as nano on the CLI, Notepad or TextEdit. You can even use MS Excel to enter the different values and then save it to CSV.

After collecting the data, we must process it most of the times before we can plot something useful. We will illustrate this process of reading values, processing and then exporting them with an easy example that illustrates the most important aspects.

Consider the circuit depicted in the figure below (impedance values only for reference). We want to know what the (transfer) function is (from the figure we immediately see it is a low-pass filter). Because we do not want to measure too many points and the frequency axis is typically split up logarithmically, we will measure three points per decade. Thus, we apply a certain sinusoidal voltage at point 1 and measure the response at the output (point 2). The measurement data is displayed below.

{{< two_columns >}}
{{< column "six" >}}
{{< fig file="matlab-scripting-circuit.svg" id="electrical-circuit" alt="circuit figure" imgClass="centre-element max-600px-wide" caption="Analogue circuit filter" >}}
{{< /column >}}
{{< column "six centre-element" >}}
| element       | value             |
|---------------|-------------------|
| R<sub></sub>  | 971Ω ± 1Ω         |
| R<sub>2</sub> | 555kΩ ± 1kΩ       |
| L             | 4.71mH ± 0.01mH   |
| C<sub>1</sub> | 1.467nF ± 0.001nF |
| C<sub>2</sub> | 4.55nF ± 0.01nF   |
| C<sub>3</sub> | 19.2pF ± 0.1pF    |
{{< /column >}}
{{< /two_columns >}}

{{< fig file="latex-matlab-scripting-tf1.svg" id="meas-plot-1" igClass="centre-element max-600px-wide" caption="Transfer function rapid measurement." alt="transfer function 1">}}


Data processing, in this case, is limited to the calculation of the transfer function (voltage ratio and phase). This is exactly what this script is doing:

{{< highlight matlab >}}
% Example MATLAB script: read date from file, process and write to file

% read global data
%  'measured_data.csv': source file
%  ',': the data separation symbol
%  1: skip first row (contains column headers)
%  0: read all columns
M = dlmread('measured_data.csv',',',1,0);

% extract data from M into more meaningful names
f = M(1:size(M,1),1);
V1 = M(1:size(M,1),2);
V2 = M(1:size(M,1),3);
phi = M(1:size(M,1),4);

% calculate transfer function (amplitude!)
T = V2./V1;

% write data to output matrix
% -phi because arg(T) = arg(V2)-arg(V1) and phi = arg(V1)-arg(V2)!
out = [f,T,-phi];

% write data to file
outfile = 'transfer_function.csv';               % output filename
header = 'f_Hz,T,phi_degree';                    % column headers
dlmwrite(outfile,header,'delimiter','');         % write header
dlmwrite(outfile,out,'delimiter',',','-append'); % append data
{{< /highlight >}}

The CSV-file looks like this (this just the first part of the measurement data):

{{< highlight text >}}
f_Hz,VP_V,VS_V,phi_degree
500,4.945,4.685,3.7
1000,4.967,4.665,7.4
2000,4.945,4.561,13.4
5000,5.019,4.175,32
7500,4.545,3.757,44.5
{{< /highlight >}}

It is obvious an interesting phenomenon occurs between 50kHz and 100kHz. Now suppose, we ignored the effect at 75kHz (e.g. because of measurement error, not displayed in the tables) and only considered the low pass effect. But later someone (read: a fellow student or collegue) notices the unusual phenomenon and decides it should be investigated further. We end up with additional measurement data that needs processing and plotting. Because we used an automated script, we do not need to manually recompute the transfer function, we just rerun the script.

If we write a script, we only have to enter the new measurement points in our CSV-file and that's it. Thus, scripting takes a bit more work to get going in the beginning, but can further reduce the workload drastically (espcially in more complicated setups). The result is depicted in the figure below.

<figure id="meas-plot-2" class="centre-element">
![transfer function 2](/images/matlab/latex-matlab-scripting-tf2.svg "Detailed transfer function"){:.max-600px-wide}
</figure>

We now have enough data to plot our final transfer function. This can be done with `pgfplots` from a CSV-file. However, we will not go into detail about how to do this, since it is already described [here]({{< ref "/blog/latex-plotting-from-file/index.md">}}).

## Plot and Export Data in MATLAB

Sometimes it is not possible to plot data directly in `pgfplots` in an easy way, for example when the number of data points becomes very lager (more than 500). In that case the `pgfplots` buffer is too small (`pgfplots` needs more than 500MB typically) and compilation is impossible. A way to fix this is to increase the buffer size, but this is not trivial and system dependent. As a consequence, we will not plot our data in `pgfplots`, but directly in MATLAB. The MATLAB plot will be exported to a common file format (PNG, PDF) and included in our LaTeX file.

Plotting data in MATLAB is very easy, the `plot`-command (or a variant) is most of the times sufficient. An example is illustrated for the transfer function (Bode-plot) below:

{{< highlight matlab >}}
% create Bode plot
tf_fig = figure;
title('Bode plot analog filter');
subplot(2,1,1);
semilogx(f,20*log10(T),'linewidth',2);
xlabel('frequency [Hz]');
ylabel('amplitude [dB]');
subplot(2,1,2);
semilogx(f,-phi,'linewidth',2);
xlabel('frequency [Hz]');
ylabel('phase [degree]');
{{< /highlight >}}

The final thing to do, is write this plot to a file which can be used in LaTeX. Possible formats are PDF, PNG and EPS. Personally, I prefer PDF because if is vector based (in contrast to PNG, which is pixel-based and thus becomes blurry when zooming in), and easily produced.

Writing the plot to a file is done by printing to file. To have only the plot, we first determine the plot size and set the size units. Next, we extract the plot location on the screen. All this is needed because we only want the plot and do not want too much whitespace at the edges (there always is some). Finally, we print the plot to a file named `transfer_function_figure.pdf`. Notice we explicitly denote the figure handle `tf_fig`. This makes our code more robust (as opposed to using `gcf`) when we would add an additional figure to the script.

{{< highlight matlab >}}
% save plot to pdf
set(tf_fig,'Units','inches');             % set figure size unites to inches
screenposition = get(tf_fig,'Position');  % get location on screen
set(tf_fig,'PaperPosition',[0 0 screenposition(3:4)],...
    'PaperSize',screenposition(3:4));     % set print size to figure size
% save as pdf (-dpdf option) and render as vector graphics (-painters
% option) to transfer_function_figure (filename)
print(tf_fig,'-dpdf','-painters','transfer_function_figure');
{{< /highlight >}}

## Source Code

All source code used to create this page, including measurement data, is contained in the MATLAB-file (`.m`) and CSV-file (`.csv`).

{{< dfile type="m" file="latexMatlabScriptingExample.m" >}}
{{< dfile type="csv" file="latexMatlabScriptingAllData.csv" >}}

