---
layout: page
title: "Q59894: Linker Error L2013 May Be a Result of a Problem in MASM 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q59894/
---

	Article: Q59894
	Product: Microsoft C
	Version(s): 3.x 4.06 4.07 5.01.21 5.02 5.03 5.05
	Operating System: MS-DOS
	Flags: ENDUSER | h_masm
	Last Modified: 27-DEC-1990
	
	The error message for linker error L2013 is as follows:
	
	   error L2013 LIDATA record too large
	      pos: xxx Record type: 743C
	
	In the README.DOC file that comes with MASM version 5.10, Microsoft C
	version 5.10, and the "Microsoft FORTRAN CodeView and Utilities User's
	Guide" version 5.00 manual, the recommended course of action is to
	call Microsoft Product Support at (206) 637-7096.
	
	The error is a result of an invalid object module. This is a known
	problem in MASM 5.10. The most likely cause is a duplication of some
	large data item, such as a structure.
	
	The easiest workaround is to break up the duplication(s) into smaller
	parts.
