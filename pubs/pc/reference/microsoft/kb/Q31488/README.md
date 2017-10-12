---
layout: page
title: "Q31488: UTILITY.DOC: Filetab Switch Expands Tabs"
permalink: /pubs/pc/reference/microsoft/kb/Q31488/
---

	Article: Q31488
	Product: Microsoft C
	Version(s): 1.00 | 1.00
	Operating System: OS/2 | MS-DOS
	Flags: ENDUSER | tar71845
	Last Modified: 16-JUN-1988
	
	Information about the filetab switch can be found in the
	UTILITY.DOC file that comes with the Microsoft BASIC Compiler Version
	6.00, the Microsoft C Compiler Version 5.10, the Microsoft FORTRAN
	Compiler Version 4.10 and the README.DOC for Microsoft MASM Version
	5.10.
	   The filetab switch is a numeric switch that determines how the
	editor translates tabs when loading a file into memory. The value of
	the switch gives the number of spaces associated with each tab column.
	   For example, the setting "filetab:4" assumes a tab column every four
	positions on each line of a file.
	   Every time the editor finds a tab character in a file, it loads the
	buffer with the number of spaces necessary to get to the next tab
	column. Depending on the value of the entab switch, the editor also
	uses the filetab switch to determine how to convert spaces into tabs
	when writing a file.
	   The default value of filetab is eight (8).
