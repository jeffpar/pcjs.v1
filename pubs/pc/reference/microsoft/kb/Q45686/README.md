---
layout: page
title: "Q45686: How to Round Up a Fraction to Its Integral Ceiling in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q45686/
---

## Q45686: How to Round Up a Fraction to Its Integral Ceiling in BASIC

	Article: Q45686
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_BasicInt B_BBasic B_MQuickB
	Last Modified: 13-DEC-1989
	
	The mathematical ceiling function (which rounds up to the next higher
	integral value for any fraction) is not built into the BASIC language.
	To compute the ceiling, use the following function:
	
	   DEF FNceil#(x#) = -INT(-x#)
	
	   x# = 50.0001
	   PRINT FNceil#(x#)    ' Prints 51
	
	This function is equivalent to the ceil() function in the C language.
	
	This function works in the following products:
	
	1. Microsoft QuickBASIC Version 1.00 for the Macintosh
	
	2. Microsoft BASIC Compiler Version 1.00 for the Macintosh
	
	3. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Macintosh
	
	4. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, 4.50 for the IBM PC
	
	5. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	6. Microsoft BASIC Compiler Versions 6.00 and 6.00b and Microsoft
	   BASIC PDS Version 7.00 for MS OS/2 and MS-DOS
	
	7. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	The code example below can be used in Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50 for MS-DOS and in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b and Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2, but not in earlier versions:
	
	DECLARE FUNCTION ce& (x#)   ' Function returns long integer
	DECLARE FUNCTION ceil# (x#) ' Function returns double precision
	CLS
	x# = 40000005.001#
	y# = 50.000000000001#
	PRINT ceil#(x#)  ' Prints 40000006
	PRINT ceil#(y#)  ' Prints 51
	PRINT ce&(y#)    ' Prints 51
	PRINT ce&(x#)    ' Prints 40000006
	FUNCTION ceil# (x#) STATIC
	ceil# = -INT(-x#)  ' Can pass values of x# in double-precision range
	END FUNCTION
	
	FUNCTION ce& (x#) STATIC
	ce& = -INT(-x#)    ' Values of x# outside -2147483648 to 2147483647
	END FUNCTION       ' will give a long-integer overflow error.
