---
layout: page
title: "Q45903: chdir() Description Incorrect in Manual and On-Line Help"
permalink: /pubs/pc/reference/microsoft/kb/Q45903/
---

	Article: Q45903
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-JUN-1989
	
	The description of the chdir() function provided with the Microsoft
	QuickC Compiler Version 2.00 is incorrect in the "Run-Time Library
	Reference" manual on Page 156 and in the QuickC Advisor (on-line
	help). In both cases the example call in the description section
	should read as follows:
	
	   chdir("c:\\temp");
	
	The sample call in the description section of the on-line help reads
	as follows:
	
	   chdir("c:\temp")
	
	It needs an additional backslash "\". To see this error, use the
	Help.Index menu selection, then choose the chdir() function, and
	change to the description section.
	
	The sample call in the manual reads as follows:
	
	   chdir(c:\temp);
	
	This description needs another backslash (\) and quotes around the
	directory.
