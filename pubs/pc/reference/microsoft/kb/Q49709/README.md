---
layout: page
title: "Q49709: VAL Function Concatenates Digits That Have Embedded Spaces"
permalink: /pubs/pc/reference/microsoft/kb/Q49709/
---

## Q49709: VAL Function Concatenates Digits That Have Embedded Spaces

	Article: Q49709
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890829-89 B_GWBasicI B_BasicCom B_BasicInt B_MQuickB
	Last Modified: 1-JAN-1990
	
	The VAL function concatenates all digits that are separated by a
	space, a tab, or a linefeed character in the string argument.
	
	In other words, VAL ignores space, tab, and linefeed characters that
	are embedded (leading or trailing) in the string argument. For
	example, the following code prints a value of 345678 (not 34):
	
	   a$ = "  34  56  78"
	   PRINT VAL(a$)
	
	This behavior applies to Microsoft BASIC on most operating systems,
	including the following products:
	
	1. Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 6.0, and 6.00b for MS-DOS
	   and MS OS/2
	
	3. Microsoft BASIC Profesional Development System 7.00 for MS-DOS.
	
	4. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	5. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	6. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh
	
	7. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	8. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
	
	The following code prints a value of 123.45 (not just 12) because
	spaces are ignored. The first decimal point is treated as part of the
	number, and the second decimal point acts as a delimiter:
	
	   a$ = "12  3.4  5.6"
	   PRINT VAL(a$)
	
	The following examples also print 123.45, thus showing that tab and
	linefeed characters, as well as spaces, are ignored by the VAL
	function:
	
	   a$="12"+CHR$(9)+" 3.4  5.6")    ' CHR$(9) is a tab character.
	   PRINT VAL(a$)    ' PRINTs 123.45
	   a$="12"+CHR$(10)+" 3.4  5.6")   ' CHR$(10) is linefeed character.
	   PRINT VAL(a$)    ' PRINTs 123.45
	
	To work around this behavior, make sure to separate with commas the
	numbers passed to VAL in a string. You can also parse the string into
	a new string before invoking VAL, such as in the following workaround.
	
	Workaround Example
	------------------
	
	This program parses a string a$ such that the first trailing blank
	delimits the end of a number.
	
	PRINT "Enter the numeric string to parse ";
	LINE INPUT a$
	x = 1
	b$ = ""
	c$ = ""
	DO UNTIL x > LEN(a$)
	   c$ = MID$(a$, x, 1)    ' Puts character at column x into c$
	   IF c$ <> CHR$(32) THEN
	      b$ = b$ + c$        ' Build a string with no spaces.
	   ELSEIF LEN(b$) > 0 THEN
	      PRINT VAL(b$)
	      EXIT DO             ' Stop parsing if trailing blank is found.
	   END IF
	   x = x + 1
	LOOP
	
	Programming note: The above example uses the DO...LOOP statement,
	which requires QuickBASIC 3.00 or later. For other products, use a
	different looping structure.
