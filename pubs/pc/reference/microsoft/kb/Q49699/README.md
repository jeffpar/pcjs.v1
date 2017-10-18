---
layout: page
title: "Q49699: MASM Err Msg A2063, Name in .MODEL SMALL Not Ignored"
permalink: /pubs/pc/reference/microsoft/kb/Q49699/
---

## Q49699: MASM Err Msg A2063, Name in .MODEL SMALL Not Ignored

	Article: Q49699
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 29-MAR-1990
	
	Page 89 of the "Microsoft Macro Assembler 5.0 for the MS-DOS Operating
	System: Programmer's Guide" incorrectly states that the name is
	ignored if given with small or compact models.
	
	With .MODEL SMALL or .MODEL COMPACT, the name for code segments is not
	ignored, but does produce the following error:
	
	   A2063: Operand Combination Illegal
	
	On the other hand, .MODEL MEDIUM inserts a _text or append an _text to
	a name.
