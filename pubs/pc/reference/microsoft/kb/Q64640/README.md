---
layout: page
title: "Q64640: Online Help Solution for C4139 Warning Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q64640/
---

## Q64640: Online Help Solution for C4139 Warning Is Incorrect

	Article: Q64640
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc docerr
	Last Modified: 19-JAN-1991
	
	Using hexadecimal constants in strings results in a compiler warning
	"C4139: '0xsequence' : hex escape sequence is out of range" if the hex
	digits following the "\x" escape character evaluate to a number too
	large to be converted to an ASCII character. The online help for
	Microsoft C versions 6.00 and 6.00a and QuickC versions 2.50 and 2.51
	show an example of code that produces the following warning:
	
	   printf("\x7bell\n");   /* Error-Causing Code */
	
	Next, the following workaround is given to resolve the problem:
	
	   printf("\x007bell\n");  /* Supposed to solve problem */
	
	Unfortunately, the second printf() statement produces the same error
	as the first.
	
	In Microsoft C version 5.10 and QuickC version 2.00, hexadecimal
	escape sequences are limited to three characters. C version 6.00 and
	QuickC version 2.50 now conform to the ANSI specification by treating
	every potential hexadecimal digit following the "\x" as part of the
	constant.
	
	Three valid workarounds are listed below:
	
	1. printf("\x007""bell\n");
	
	2. char TypeArray[] = "\x007""bell";
	
	   printf("%s\n", TypeArray);
	
	   Note: According to the ANSI standard, adjacent string literals are
	   concatenated after escape sequences have been calculated.
	
	3. printf("\007bell\n");     /* Use Octal */
	
	   Note: This workaround uses an octal constant rather than a
	   hexadecimal constant, and is a good solution if portability is a
	   concern.
	
	Additional information is given in the C 6.00 README.DOC file in Part
	2: "Differences between C 5.1 and 6.0," under the subtitle
	"Hexadecimal Constants in Strings."
