---
layout: page
title: "Q50012: Undocumented Switch &quot;Sethelp&quot; for M Version 1.02"
permalink: /pubs/pc/reference/microsoft/kb/Q50012/
---

## Q50012: Undocumented Switch &quot;Sethelp&quot; for M Version 1.02

	Article: Q50012
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 24-JAN-1991
	
	If you have the M (or MEP) Editor version 1.02 configured for online
	help, you can use the undocumented "Sethelp" switch to load additional
	help files within the editor by using the following syntax:
	
	   Arg textarg Sethelp      ;ALT+A textarg ALT+S
	
	Textarg corresponds to the full pathname of the .HLP file you want to
	load. By default, the sethelp function is mapped ALT+S.
	
	For example, load the QC.HLP help file that comes with QuickC with the
	following command:
	
	   ALT+A D:\QC\QC.HLP ALT+S
	
	Now you could place the cursor on printf (or any other C language item
	that is in the Help file) and press F1 to get help on that topic.
