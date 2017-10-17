---
layout: page
title: "Q21311: How DEFINT, DEFSNG, DEFDBL Affect Type of DEF FN Function"
permalink: /pubs/pc/reference/microsoft/kb/Q21311/
---

## Q21311: How DEFINT, DEFSNG, DEFDBL Affect Type of DEF FN Function

	Article: Q21311
	Version(s): 5.35 5.36 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS                         | OS/2
	Flags: ENDUSER | B_QuickBas B_BasicInt
	Last Modified: 17-JAN-1991
	
	This article discusses the default type declaration of DEF FN
	user-defined functions in Microsoft BASIC.
	
	The DEFINT, DEFLNG, DEFDBL, and DEFSNG statements affect the first
	letter of the variable part of a DEF FN function name, and not the FN
	part of the function name. This information applies to all Microsoft
	BASIC compilers and interpreters for MS-DOS, MS OS/2, Macintosh, and
	CP/M-80.
	
	Microsoft BASIC Compiler versions 6.00 and later, and QuickBASIC
	versions 4.00 and later for the IBM PC, introduced the DEFLNG
	statement for long integer declaration, which also behaves this way.
	
	Example
	-------
	
	The following program prints 1.2 (a noninteger):
	
	   10 DEFINT F   ' DEFINT F doesn't affect the DEF FN below.
	   20 DEF FNAB=1.2
	   30 PRINT FNAB
	
	The following program prints 1 (truncated to an integer):
	
	   10 DEFINT A   ' DEFINT A does affect the DEF FN below.
	   20 DEF FNAB=1.2
	   30 PRINT FNAB
