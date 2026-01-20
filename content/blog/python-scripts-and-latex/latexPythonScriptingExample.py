# Example Python script: read file data, compute, make plot and export

import matplotlib.pyplot as pyplot
from numpy import genfromtxt
import numpy as np

data = genfromtxt('latexMatlabScriptingAllData.csv', delimiter=',', skip_header=1)
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

# generate plot
fig = pyplot.figure()
fig.add_subplot(2, 1, 1)
pyplot.semilogx(f, 20 * np.log10(T))
pyplot.xlabel('frequency [Hz]')
pyplot.ylabel('transfer function [V/V]')
fig.add_subplot(2, 1, 2)
pyplot.semilogx(f, phi)
pyplot.xlabel('frequency [Hz]')
pyplot.ylabel('phase [degree]')

# fix plot sizes (otherwise, some plots and labels might overlap)
fig.set_tight_layout(True)

# display plot
pyplot.show()

# save plot to file
fig.savefig('transfer_function_figure_py.pdf')

# save data to file (np.c_ can be replaced by np.transpose)
np.savetxt('transfer_function_py.csv', np.c_[f, T, phi], delimiter=',', header="f_Hz,T,phi_degree", comments='')
