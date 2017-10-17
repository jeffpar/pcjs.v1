---
layout: page
title: "Q44492: Mandelbrot Example Needs to Change &quot;LogicY&quot; to a SINGLE"
permalink: /pubs/pc/reference/microsoft/kb/Q44492/
---

## Q44492: Mandelbrot Example Needs to Change &quot;LogicY&quot; to a SINGLE

	Article: Q44492
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom docerr
	Last Modified: 20-DEC-1989
	
	The MANDEL.BAS program example on Pages 213-217 of the "Microsoft
	QuickBASIC 4.5: Programming in BASIC" manual for Version 4.50, on
	Pages 263-267 of the "Microsoft QuickBASIC 4.0: Programming in BASIC:
	Selected Topics" manual for Versions 4.00 and 4.00b, and on Pages
	211-215 of the "Microsoft BASIC 7.0: Programmer's Guide" for Microsoft
	BASIC PDS Version 7.00 does not work correctly for all WINDOW
	coordinates, unless the variable "LogicY" is changed to a SINGLE or
	DOUBLE precision variable.
	
	To correct the problem, change all occurrences of LogicY to LogicY! or
	add the following line to the beginning of the program:
	
	   DIM LogicY AS SINGLE
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50
	for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	For more information, query on the following words in this
	Knowledge Base:
	
	   PMAP and MAP and WINDOW and INTEGER
