---
layout: page
title: "Q63322: C 5.00/5.10 and 6.00 Regard Right Arrow Character (1Ah) as EOF"
permalink: /pubs/pc/reference/microsoft/kb/Q63322/
---

## Q63322: C 5.00/5.10 and 6.00 Regard Right Arrow Character (1Ah) as EOF

	Article: Q63322
	Version(s): 5.00 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	In Microsoft C versions 5.10 and 6.00, the right arrow character (1Ah)
	is read as an end-of-file (EOF) character, even if it occurs nested
	within a character string.
	
	The unexpected EOF can be avoided by inserting an escape sequence
	within the string to replace the right arrow character. Use the
	following
	
	   printf("Hello""\x1a""world.");
	
	instead of:
	
	   printf("Hello(right arrow character)world");
	
	Using the proper format forces the compiler to recognize the hex 1A as
	an escape sequence, instead of an EOF. If the escape sequence is not
	separated from the rest of the string, it may be read as a different
	hex value, since characters will appear directly after it. In addition
	to hex values, an octal value may be used.
