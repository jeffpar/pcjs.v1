---
layout: page
title: "Q35146: QB.EXE Editor Printing Source Code to 132-Column Printers"
permalink: /pubs/pc/reference/microsoft/kb/Q35146/
---

## Q35146: QB.EXE Editor Printing Source Code to 132-Column Printers

	Article: Q35146
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 27-DEC-1989
	
	To make the Print command on the QuickBASIC editor File menu default
	to 132 columns instead of 80 columns, you can issue the following DOS
	command:
	
	   MODE LPT1:132
	
	You can reset the printer to 80 columns by executing the following DOS
	command:
	
	   MODE LPT1:80
	
	This information applies to the QB.EXE editor in Microsoft QuickBASIC
	Compiler Versions 4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to the QBX.EXE
	editor that comes with Microsoft BASIC PDS Version 7.00 for MS-DOS and
	MS OS/2.
