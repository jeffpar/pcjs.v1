---
layout: page
title: "Q61919: CV 3.00 Gives R6000, Hangs When Accessing Help During Start-Up"
permalink: /pubs/pc/reference/microsoft/kb/Q61919/
---

	Article: Q61919
	Product: Microsoft C
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 fixlist3.10
	Last Modified: 5-FEB-1991
	
	Accessing help in the "Enter directory for filename.c (cr for none)?"
	window results in the following error in CodeView version 3.00:
	
	   run-time error R6000
	   -stack overflow
	
	Then, the machine hangs requiring a cold reboot.
	
	To reproduce the error, do the following:
	
	1. Compile and link a program with symbolic information for CodeView.
	
	2. Delete or rename the source file and then go into CodeView. A
	   window will appear asking you to "Enter directory for filename.c
	   (cr for none)?".
	
	3. Choose the Help option at the bottom of the window. The run-time
	   error message will be printed over the CodeView screen and the machine
	   will be hung.
	
	The problem does not occur under OS/2.
	
	Microsoft has confirmed this to be a problem in CodeView version 3.00.
	This problem was corrected in CodeView version 3.10.
