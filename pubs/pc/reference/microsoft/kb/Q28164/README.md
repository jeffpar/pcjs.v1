---
layout: page
title: "Q28164: Unexpected PRINT USING &quot;.##&quot; Rounding for .xx5"
permalink: /pubs/pc/reference/microsoft/kb/Q28164/
---

## Q28164: Unexpected PRINT USING &quot;.##&quot; Rounding for .xx5

	Article: Q28164
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-FEB-1991
	
	This article describes a case where the PRINT USING statement appears
	to round numeric constants to unexpected values. This information
	applies to Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 for
	MS-DOS; to Microsoft BASIC Compiler versions 6.00, 6.00b for MS-DOS
	and MS OS/2; and to Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	For the following statement
	
	   PRINT USING " ###.##"; .245, .255, .265, .275, .285
	
	the above BASIC versions give the following output
	
	   0.25  0.25  0.26  0.28  0.28
	
	while you might have expected the following rounding
	
	   0.25  0.26  0.27  0.28  0.29
	
	or with IEEE rounding (to the nearest even integral value), you would
	expect the following:
	
	   0.24  0.26  0.26  0.28  0.28
	
	This behavior occurs because the internal representation of the
	numbers used by BASIC (IEEE floating-point format) differs slightly
	from the decimal numbers typed into the source code.
	
	IEEE floating-point format cannot accurately represent numbers that
	are not of the form 1.x to the power of y (where x and y are base 2
	numbers). The internal representation will be slightly more or
	slightly less than the decimal numbers typed into the source code.
	
	The internal representations are correctly rounded and displayed in
	the above program. This is not a software problem.
	
	If you want floating-point constants in the source code to be exactly
	stored, you can append the constant with the CURRENCY type-cast
	operator, an "at sign" (@) character. The CURRENCY data type is only
	found in Microsoft BASIC PDS 7.00 and 7.10. The following example
	rounds to 0.25, 0.26, 0.27, 0.28, 0.29 as you may have wanted:
	
	   PRINT USING " ###.##"; .245@, .255@, .265@, .275@, .285@
	
	Note that the CURRENCY data type can store 19 digits, but only 4
	digits can be used after the decimal point.
