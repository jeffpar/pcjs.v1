---
layout: page
title: "Q31783: Inverse of x&#36; = HEX&#36;(n) Is VAL(&quot;&amp;H&quot;+x&#36;); Inverse for Octal..."
permalink: /pubs/pc/reference/microsoft/kb/Q31783/
---

## Q31783: Inverse of x&#36; = HEX&#36;(n) Is VAL(&quot;&amp;H&quot;+x&#36;); Inverse for Octal...

	Article: Q31783
	Version(s): 1,x 2.x 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_BasicInt B_MQuickB
	Last Modified: 21-DEC-1989
	
	The HEX$(n) function converts a number n to a string in hexadecimal
	notation.
	
	To convert a hexadecimal-notation string (x$) back to a numeric value
	from x$ = HEX$(n), use VAL("&H" + x$).
	
	The OCT$(n) function converts a number n to a string in octal notation.
	
	To convert a octal-notation string (x$) back to a numeric value from
	x$ = OCT$(n), use VAL("&O" + x$).
	
	These formulas apply to any of the following Microsoft BASIC products:
	
	1. Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Version 5.35 and 5.36 for MS-DOS
	
	3. Microsoft BASIC Compiler Version 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	5. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	6. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh
	
	7. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	8. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
