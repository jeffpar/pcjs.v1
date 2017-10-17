---
layout: page
title: "Q35665: INPUT, INKEY&#36;, or INPUT&#36;(n) Don't Accept All ASCII Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q35665/
---

## Q35665: INPUT, INKEY&#36;, or INPUT&#36;(n) Don't Accept All ASCII Characters

	Article: Q35665
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 11-DEC-1989
	
	Extended ASCII characters have values from 128 through 255, and can be
	typed by holding down the ALT key and pressing three digits on the
	numeric keypad. However, there are some extended ASCII characters that
	the INKEY$, INPUT$(1), and INPUT statements/functions cannot accept.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in Microsoft BASIC Compiler
	Version 7.00 (fixlist7.00).
	
	The only three ALT+KEY combinations that don't display are ALT+244,
	ALT+240 and ALT+253.
	
	The following is a code example:
	
	'This program will trap some of the ASCII characters entered with the
	'ALT+xxx method, but not all. For example: ALT+205 will print a '═' on
	'the screen, but ALT+253 will not print a superscript 2 on the screen.
	
	CLS
	CASA:
	  a$=INKEY$
	  IF a$ <> "" THEN PRINT a$;
	  GOTO CASA
	END
