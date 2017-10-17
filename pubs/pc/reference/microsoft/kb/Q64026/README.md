---
layout: page
title: "Q64026: CodeView Crashes in DOS on &quot;Drive Not Ready&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q64026/
---

## Q64026: CodeView Crashes in DOS on &quot;Drive Not Ready&quot; Error

	Article: Q64026
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00
	Last Modified: 25-JUL-1990
	
	CodeView version 3.00 may hang after encountering a "Drive Not Ready"
	error. This error may occur if a file is opened on Drive A and a disk
	is not in the drive.
	
	To reproduce this problem, compile the following program with CodeView
	options (cl /Zi /Od):
	
	   main () {
	     FILE *fp;
	     fp = fopen("a:\readme.doc","r");
	   }
	
	If you run the program in CodeView version 3.00 without a disk in
	Drive A and press F5 to run the program, the following error will
	appear:
	
	   Not ready reading drive A
	   Abort, Retry, Fail?
	
	Regardless of what is typed, the machine will hang and you must do a
	cold reboot to remedy the crash.
	
	Note: CodeView versions 2.20 and 2.30 do not hang the machine if the
	above steps are executed. The fopen() just returns a NULL. OS/2 also
	handles the error correctly in versions 2.20, 2.30, and 3.00 of
	CodeView.
	
	Microsoft has confirmed this to be a problem with CodeView version
	3.00. We are researching this problem and will post new information
	here as it becomes available.
