---
layout: page
title: "Q31789: Converting between Decimal, Octal, and Binary Numbers"
permalink: /pubs/pc/reference/microsoft/kb/Q31789/
---

## Q31789: Converting between Decimal, Octal, and Binary Numbers

	Article: Q31789
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_GWBasicC B_BasicInt B_BBasic
	Last Modified: 21-DEC-1989
	
	The Microsoft BASIC code below demonstrates how to perform the
	following conversions between decimal, octal, and binary numbers:
	
	1. Convert an octal number to a decimal (base 10) number
	
	2. Convert a decimal number to an octal (base 8) number
	
	3. Convert a decimal number to a binary (base 2) number
	
	The following code example will perform the conversions:
	
	' 1. Octal string to decimal Number:
	INPUT "INPUT Octal number:"; octal$
	PRINT VAL("&O" + octal$)
	
	' 2. Decimal Number to octal string:
	INPUT "INPUT Decimal number:"; Decimal
	PRINT OCT$(Decimal)
	
	' 3. Decimal Number to Binary string:
	Bin$ = ""
	INPUT "INPUT Decimal number:"; Decimal
	FOR i = 14 TO 0 STEP -1           ' Positive numbers only
	  pow2 = 2 ^ i
	  IF Decimal >= pow2 THEN
	     Decimal = Decimal - pow2: Bin$ = Bin$ + "1"
	  ELSE Bin$ = Bin$ + "0"
	  END IF
	NEXT i
	PRINT Bin$
	
	The above information applies to most Microsoft BASIC products,
	including the following BASICs:
	
	1. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	2. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
	
	3. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b and 4.50 for the IBM PC
	
	4. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	5. Microsoft BASIC Compiler Version 6.00 for MS-DOS and MS OS/2
	
	6. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	7. Microsoft GW-BASIC Interpreter Version 3.20
	
	8. Microsoft BASIC Compiler and Interpreter for the XENIX Operating
	   System
