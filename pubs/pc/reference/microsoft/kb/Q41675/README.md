---
layout: page
title: "Q41675: QuickC 2.00 README.DOC: Searching for OS/2 Include Files"
permalink: /pubs/pc/reference/microsoft/kb/Q41675/
---

	Article: Q41675
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information is taken from the QuickC Version 2.00
	README.DOC file, part 4, "Notes for Windows and OS/2 Programmers."
	
	Searching for Include Files
	
	The following command line is valid even if you do not have the OS/2
	software, as described previously:
	
	   QCL /Lp /c myfile.c
	
	If myfile.c includes an OS/2 include file, however, QCL returns the
	following error:
	
	   C1068  Cannot open file 'name.h'
	
	where 'name.h' is the name of the OS/2 include file.
