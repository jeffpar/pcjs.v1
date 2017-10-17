---
layout: page
title: "Q68025: &quot;Feature Removed&quot; Using WIDTH &quot;LPT1:&quot;,wdth% and BC /Fs in 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q68025/
---

## Q68025: &quot;Feature Removed&quot; Using WIDTH &quot;LPT1:&quot;,wdth% and BC /Fs in 7.00

	Article: Q68025
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S901220-9 buglist7.00 fixlist7.10
	Last Modified: 9-JAN-1991
	
	Compiled with the far strings (BC /Fs) option, the following statement
	incorrectly gives the error message "Feature removed":
	
	   WIDTH "LPT1:",137
	
	This statement works correctly within the QBX.EXE environment.
	
	Microsoft has confirmed this to be a problem in BASIC Professional
	System (PDS) versions 7.00 for MS-DOS. This problem was corrected in
	BASIC PDS version 7.10.
	
	Enter the following program and name it SAMPLE.BAS:
	
	   wdth% = 137
	   WIDTH "LPT1:",wdth%
	
	Compile the program with the following options:
	
	   BC SAMPLE.BAS /D/O/Fs/Lr/FPi/T/C:512;
	   LINK SAMPLE.OBJ;
	
	Now, run SAMPLE.EXE to demonstrate the error message "Feature removed
	in line No line number in module <name>".
	
	To work around the problem, compile without the far strings option
	(without /Fs), or upgrade to version 7.10, or change the program to
	read as follows:
	
	   WIDTH LPRINT wdth%
