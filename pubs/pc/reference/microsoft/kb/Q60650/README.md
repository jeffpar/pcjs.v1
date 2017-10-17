---
layout: page
title: "Q60650: C 6.00 SAMPLES.DOC: Note on Graphics Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q60650/
---

## Q60650: C 6.00 SAMPLES.DOC: Note on Graphics Libraries

	Article: Q60650
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | README README.DOC
	Last Modified: 19-APR-1990
	
	The following information is taken from the C Version 6.00 SAMPLES.DOC
	file.
	
	Note on Graphics Libraries
	--------------------------
	
	GRDEMO and CHRTDEMO require GRAPHICS.LIB. CHRTDEMO also requires
	PGCHART.LIB. SORTDEMO requires GRAPHICS.LIB for DOS or GRTEXTP.LIB for
	OS/2. If you did not request these libraries in your combined library
	files during setup, you will get "unresolved external" linker errors
	when you try to compile the programs.
	
	If you are using CL, specify the library names on the command line.
	For example, use this command line to compile GRDEMO:
	
	   CL GRDEMO.C MENU.C TURTLE.C GRAPHICS.LIB
	
	If you are using PWB, you can use the supplied program list (.MAK)
	files. These automatically add the appropriate libraries.
