---
layout: page
title: "Q30493: EXTRN Misspelled in Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q30493/
---

## Q30493: EXTRN Misspelled in Manual

	Article: Q30493
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-JAN-1989
	
	In the "Microsoft Macro Assembler Programmer's Guide" there are
	misspelled EXTRNs, as follows:
	
	Page 90:  EXTR   xvariable:FAR
	          EXTR   xprocedure:PROC
	
	Page 95:  EXTR   xvariable:FAR
	
	The EXTRNs should be as follows:
	
	Page 90:  EXTRN  xvariable:FAR
	          EXTRN  xprocedure:PROC
	
	Page 95:  EXTRN  xvariable:FAR
