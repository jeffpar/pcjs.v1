---
layout: page
title: "Q59130: WHEREIS.BAS Correction in &quot;4.5: Programming in BASIC&quot; Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q59130/
---

## Q59130: WHEREIS.BAS Correction in &quot;4.5: Programming in BASIC&quot; Manual

	Article: Q59130
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 28-FEB-1990
	
	The following statement in the program example WHEREIS.BAS on Page
	78 of the "Microsoft QuickBASIC 4.5: Programming in BASIC" manual for
	Version 4.50 is incorrect. The last line on the page incorrectly
	states the following:
	
	   OPEN TempSpec$ FOR INPUT AS #FileNu
	
	This statement should be corrected as follows:
	
	   OPEN TempSpec$ FOR INPUT AS #FileNum
	
	The WHEREIS.BAS example program is also included in the \EXAMPLES
	subdirectory on the "Setup/Microsoft QB Express" disk for QuickBASIC
	Version 4.50. The example provided on disk does not contain the error
	and executes properly in the QB.EXE environment or as an .EXE program.
	
	This documentation error has been corrected in the manuals for
	Microsoft BASIC Professional Development System 7.00 for MS-DOS and MS
	OS/2.
