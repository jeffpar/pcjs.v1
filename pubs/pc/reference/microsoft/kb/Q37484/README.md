---
layout: page
title: "Q37484: SCREEN Function Returns 32 for ASCII Byte 196 in SCREEN 3"
permalink: /pubs/pc/reference/microsoft/kb/Q37484/
---

## Q37484: SCREEN Function Returns 32 for ASCII Byte 196 in SCREEN 3

	Article: Q37484
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	The SCREEN function returns an ASCII value of 32 (a blank) for the
	character CHR$(196) in the Hercules graphics mode (SCREEN 3). The
	correct value (196) correctly returns in any other screen mode. The
	program below demonstrates the problem and gives a listing of other
	characters that the screen function will return 32.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS (buglist6.00, buglist6.00b); and in
	Microsoft BASIC PDS versions 7.00 and 7.10 (buglist7.00, buglist7.10)
	for MS-DOS. We are researching this problem and will post new
	information here as it becomes available.
	
	The following code example demonstrates the problem:
	
	   CLS
	   SCREEN 3
	   OPEN "prints32.dat" FOR OUTPUT AS #1
	   FOR x = 0 TO 255
	   CLS
	   PRINT CHR$(x)
	   PRINT SCREEN(1, 1)
	   WHILE INKEY$ = "": WEND
	   IF SCREEN(1, 1) = 32 THEN PRINT #1, x
	   NEXT x
	   CLOSE
	
	The SCREEN function returns an ASCII value of 32 (blank) for the
	following ASCII characters:
	
	   chr$(0)
	   chr$(7)
	   chr$(9)
	   chr$(10)
	   chr$(11)
	   chr$(12)
	   chr$(13)
	   chr$(28)
	   chr$(29)
	   chr$(30)
	   chr$(31)
	   chr$(32)
	   chr$(196)    ' <<====== Returns ASCII 32 (blank) only in SCREEN 3
	   chr$(255)
