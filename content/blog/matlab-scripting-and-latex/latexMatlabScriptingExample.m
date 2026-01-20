% Example MATLAB script: read data from file, process and write to file

% read global data
%  'measured_data.csv': source file
%  ',': the data seperation symbol
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

% save plot to pdf
set(tf_fig,'Units','inches');             % set figure size unites to inches
screenposition = get(tf_fig,'Position');  % get location on screen
set(tf_fig,'PaperPosition',[0 0 screenposition(3:4)],...
'PaperSize',screenposition(3:4));     % set print size to figure size
% save as pdf (-dpdf option) and render as vector graphics (-painters
% option) to transfer_function_figure (filename)
print(tf_fig,'-dpdf','-painters','transfer_function_figure');

% write data to file
outfile = 'transfer_function.csv';               % output filename
header = 'f_Hz,T,phi_degree';                    % column headers
dlmwrite(outfile,header,'delimiter','');         % write header
dlmwrite(outfile,out,'delimiter',',','-append'); % append data
