---
title:    "Python Scripting and LaTeX"
date:     "2015-11-06T16:34:41+01:00"
tags:     [LaTeX, python, scripting]
category: LaTeX
---

{{< blank_url "Python" "(https://www.python.org" >}} is a dynamic programming language that allows fast, platform independent development. It is a high level programming language that uses a clear and consistent syntax, aiming for both concise and readable code. In contrast to MATLAB, it is a general purpose language, not directly aimed at numerical calculations. Additional functionality is provided by packages. For scientific functionality, the `SciPy` library (a package set) is key. This library adds functionality for fast numerical calculations, simulation and data visualization (and more). In this example, we will specifically make use of the `NumPy` and `matplotlib` packages.
<!--more-->

## Scripting with Python

We will reuse the example from the [MATLAB and LaTeX scripting]({{< ref "/blog/matlab-scripting-and-latex/index.md" >}}) page. The thought process is exactly the same so we will not repeat all steps and only detail the code.

Below is the first fragment of the Python-script displayed. We notice several steps: first, the necessary packages are loaded. Second, the data is loaded from file and the transfer function is computed. Finally, the data is saved to file.

{{< highlight python >}}
# Example Python script: read file data, compute, make plot and export

import matplotlib.pyplot as plt
from numpy import genfromtxt
import numpy as np

data = genfromtxt('latexMatlabScriptingAllData.csv', delimiter=',', \
                  skip_header=1)
data = np.transpose(data)  # reformat for easier data extraction

# extract data to more readable vectors
f = np.array(data[0])
V1 = np.array(data[1])
V2 = np.array(data[2])
phi = np.array(data[3])

# delete deprecated data structure
del data

# compute transfer function
T = V2 / V1
phi = -phi

# save data to file (np.c_ can be replaced by np.transpose)
np.savetxt('transfer_function_py.csv', np.c_[f, T, phi], delimiter=',', \
           header="f_Hz,T,phi_degree", comments='')
{{< /highlight >}}

If we want to plot some data, we can make use of the (already loaded) `matplotlib.pyplot` class. The plotting commands from `plotpy` are very similar (sometimes identical) to their MATLAB counterparts. Important to note are the `set_tight_layout` command and explicit `show` method call. The first method is needed to ensure everything looks good. By default, it might be possible a title or label is (partially) out of the frame. This is fixed by this call. The second command displays the actual plot. Unlike the MATLAB counterpart, `figure` does not open a figure window. The `show` method opens a window for a specific figure (`fig`).

{{< highlight python >}}
# generate plot
fig = plt.figure()
fig.add_subplot(2, 1, 1)
plt.semilogx(f, 20 * np.log10(T))
plt.xlabel('frequency [Hz]')
plt.ylabel('transfer function [V/V]')
fig.add_subplot(2, 1, 2)
plt.semilogx(f, phi)
plt.xlabel('frequency [Hz]')
plt.ylabel('phase [degree]')

# fix plot sizes (otherwise, some plots and labels might overlap)
fig.set_tight_layout(True)

# display plot
plt.show()
{{< /highlight >}}

Finally, we need to save the plot. This is much easier with Python and `pyplot` than MATLAB. A single-line command suffices:

{{< highlight python >}}
# save plot to file
fig.savefig('transfer_function_figure_py.pdf')
{{< /highlight >}}

## Source code

All source code used to create this page, including measurement data, is contained in the Python-script (`.py`) and CSV-file (`.csv`).

{{< dfile type="py" file="latexPythonScriptingExample.py" >}}
{{< dfile type="csv" file="latexMatlabScriptingAllData.csv" >}}
