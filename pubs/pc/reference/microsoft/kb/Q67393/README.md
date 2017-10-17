---
layout: page
title: "Q67393: Error in C and QuickC Example Program: BESSEL.C"
permalink: /pubs/pc/reference/microsoft/kb/Q67393/
---

## Q67393: Error in C and QuickC Example Program: BESSEL.C

	Article: Q67393
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr s_quickc
	Last Modified: 17-DEC-1990
	
	When compiling the BESSEL.C sample program with the Warning Level set
	to 4, the warning below is displayed. The sample program is available
	in the online help shipped with C versions 6.00 and 6.00a, and QuickC
	versions 2.00 and 2.50:
	
	   Warning C4129: 'F': unrecognized escape sequence
	
	The warning is caused by an extra "\" (backslash) in a printf()
	statement. The line that causes the problem is as follows:
	
	   printf("  Kind\t\t\Order\t\Function\tResult\n\n");
	
	Notice that there is an extra backslash before the word "Function."
	This should be removed.
	
	
	
	
	
	
	Microsoft QuickC
	=============================================================================
