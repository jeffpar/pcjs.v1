---
layout: page
title: "Q30844: INKEY&#36; Returns Two-Byte String for Arrow and Function Keys"
permalink: /pubs/pc/reference/microsoft/kb/Q30844/
---

## Q30844: INKEY&#36; Returns Two-Byte String for Arrow and Function Keys

	Article: Q30844
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-APR-1989
	
	The INKEY$ function returns a one- or two-byte string. Alphanumeric
	keys return one-byte strings. The function keys and the directional
	keys return two-byte strings.
	
	If INKEY$ returns a two-byte string, then each byte needs to be
	examined to determine the key that was pressed. For two-byte strings,
	the first byte will always be null [an ASCII value of zero, CHR$(0)],
	and the second byte will be the key's scan code. The LEN function
	tells you the length of the returned string (one byte or two).
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, and to the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2.
	
	The keyboard scan codes are listed in the BASIC language reference
	manual in the KEY(n) statement section.
	
	Example 1
	
	The following sample code prints a message if the UP ARROW key is
	pressed:
	
	top:
	I$ = INKEY$
	'The scan code for the UP ARROW is &H48:
	IF I$ = CHR$(0) + CHR$(&H48) THEN
	   PRINT "up arrow key pressed"
	END IF
	GOTO top
	
	Example 2
	
	The following code example shows how to print the ASCII value of any
	key pressed:
	
	REM     ASCII.BAS
	CLS
	PRINT "Hit F1 To Exit"
	PRINT:PRINT
	DO
	   A$=INKEY$
	   IF MID$(A$,1,1) <> "" THEN
	      PRINT A$
	      PRINT "ASCII Value = "; ASC(A$)
	   END IF
	   IF MID$(A$,2,1) <> "" THEN
	      PRINT "ASCII Value = "; ASC(MID$(A$,2,1))
	   END IF
	LOOP UNTIL MID$(A$,2,1) = CHR$(59)
	END
	
	Program note: The DO...LOOP statement is only supported in QuickBASIC
	3.00 or later. In earlier versions, you can rewrite this example to
	use a different loop, such as WHILE...WEND.
