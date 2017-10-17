---
layout: page
title: "Q11697: Integer &quot;Overflow&quot; Is Not Trapped without /D Debug Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q11697/
---

## Q11697: Integer &quot;Overflow&quot; Is Not Trapped without /D Debug Switch

	Article: Q11697
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | b_basiccom
	Last Modified: 20-JUL-1989
	
	The following program returns the error "Overflow in line 20 of module
	at address xxxx:xxxx" when compiled with the /D switch:
	
	   10  x% = 129
	   20  print 256 * x%
	   30  end
	
	If the sample program is compiled without the /D switch, no error is
	reported, but an incorrect (negative) value is returned.
	
	Forcing "256" to single precision by using 256! or 256.0 will
	eliminate the overflow error. "256" is an integer, and the result of
	129 times 256 is greater than 32,767, which is the highest integer
	allowed.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS and to
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2.
	
	These compilers don't handle type coercion, nor do they check for
	overflow unless the program was compiled with the /D switch.
