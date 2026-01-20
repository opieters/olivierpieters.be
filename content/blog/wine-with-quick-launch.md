---
title:  "Installing Apps with Wine and Creating a Quick Launch Command"
date:   "2015-10-03T09:20:23+02:00"
draft:  false
tags:   [Mac, Wine, Terminal]
slug: wine-with-quick-launch
---

There are many alternatives to Windows-only programmes for most tasks. However, sometimes you really need to run the Windows version. A virtual machine (VM) is a possible solution, but requires a lot of space on your computer and runs the entire Windows OS. For some programmes, this is the only way to run Windows programmes. However, others can be installed in {{< blank_url "Wine" "https://www.winehq.org" >}}.
<!--more-->

## Installing and Using Wine

The easiest way to install Wine is with {{< blank_url "Homebrew" "http://brew.sh">}} (or just brew). Just run the command `brew install wine` and Wine will be installed (with all its dependencies). Sometimes a symbolic link must be overwritten by brew. In this case, the suggested commands will be displayed by brew. So please read brew's the output and fix all errors.

Now that we have installed wine, we can go on and install Windows software. To run a Windows executable (`.exe`-file), just type `wine <my .exe-file>`. Some programmes need to be installed before they can be run, this is also supported by Wine. Programmes will be installed in the `~/.wine` folder.

## Adding a Shortcut in Terminal

If you want to run these programmes, you need to either navigate to this folder and run the wine command from there or know the path to the executable. You need to remember the exact path, far from ideal! To fix this, we will define a new command in Terminal.

Before defining a command, we need to make sure we are not interfering with any system command, so just type the command you have in mind in Terminal to check if it exists. Replace `<command>` with your command: a non-existing command will result in the following error: `-bash: <commnand>: command not found`. The command was not found and is safe to use.

By now, we have our command name. It is time to add some functionality. Open the `.bash_profile` file: `nano ~/.bash_profile`. Move to the bottom of the file and add the following:

{{< highlight shell >}}
# Wine commands:
alias <command>='wine <path-to-command>'
{{< /highlight >}}

You *must* replace `<command>` and `<path-to-command>` with your command name and path to the executable respectively.

To verify the command, run the `.bash_profile` file: `source .bash_profile` or just open a new Terminal session. Now type your command and Wine starts running your programme!
