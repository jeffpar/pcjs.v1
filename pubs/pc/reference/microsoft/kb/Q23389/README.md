---
layout: page
title: "Q23389: Unexpected Result from CINT(.5) in QB87; IEEE Rounds to Even"
permalink: /pubs/pc/reference/microsoft/kb/Q23389/
---

## Q23389: Unexpected Result from CINT(.5) in QB87; IEEE Rounds to Even

	Article: Q23389
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-FEB-1991
	
	The coprocessor version of QuickBASIC version 3.00 (QB87.EXE) returns
	0 (zero) in the following example (as do QuickBASIC versions 4.00,
	4.00b, and 4.50; Microsoft BASIC Compiler versions 6.00 and 6.00b; and
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10, which all use the IEEE floating-point format):
	
	   PRINT CINT(1/2)
	   PRINT CINT(.5)
	   PRINT CINT(1.0/2.0)
	
	Three zeros (0) are printed. This differs from the non-coprocessor
	version of QuickBASIC version 3.00 (QB.EXE) and earlier versions,
	which instead prints three ones (1).
	
	Compare this with the fact that PRINT CINT(1.5) returns 2 in both the
	coprocessor and non-coprocessor versions of QuickBASIC version 3.00
	(and in the other more recent products listed above).
	
	The observed rounding difference in the first case above is not caused
	by any bug. The IEEE standard dictates that rounding of x.5 occurs to
	the even integer nearest to x, for example, CINT(.5)=0, CINT(1.5)=2,
	CINT(2.5)=2, CINT(3.5)=4, CINT(4.5)=4, etc.
	
	The non-coprocessor version of QuickBASIC 3.00 (QB.EXE) supports a
	different floating-point format, the Microsoft Binary format (MBF),
	which rounds differently than the IEEE standard.
