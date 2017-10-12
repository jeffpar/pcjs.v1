---
layout: page
title: "Q40316: QC 2.00 SAMPLES.DOC: Note on Graphics Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q40316/
---

	Article: Q40316
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	The following information about graphic libraries is taken from the
	SAMPLES.DOC file from Microsoft QuickC Compiler Version 2.00.
	
	GRDEMO and LIFE require GRAPHICS.LIB. CHRTDEMO requires GRAPHICS.LIB
	and PGCHART.LIB. If you did not request these libraries in your
	combined library files during setup, you will get "unresolved
	external" linker errors when you try to compile the programs.
	
	If you are using the QC environment, you must add the appropriate
	library names to the program list (.MAK) files. For example, if you
	want to compile LIFE, select Edit Program List from the Make menu. A
	dialog box will appear showing the contents of the LIFE.MAK program
	list. Enter the name GRAPHICS.LIB at the File Name prompt and select
	the Save List button.
	
	If you are using QCL, specify the library names on the command line.
	For example, use this command line to compile LIFE:
	
	   QCL life.c tools.c graphics.lib
