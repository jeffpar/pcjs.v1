---
layout: page
title: "Q42949: Example of Buffered Keyboard Input Using QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q42949/
---

## Q42949: Example of Buffered Keyboard Input Using QuickBASIC

	Article: Q42949
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890319-6 B_BasicCom
	Last Modified: 15-DEC-1989
	
	The following is a program example of buffered keyboard input with
	Microsoft QuickBASIC. Buffered input allows input from the screen, but
	limits the total number of characters that can be input and typed. It
	is a standard form of input for business applications. Microsoft
	QuickBASIC does not offer this as a built-in form of input. It must be
	programmed with a combination of other BASIC statements and functions.
	
	Note that BASIC does allow input into a fixed-length string, but will
	read only up to the maximum length for that string. However, this does
	not prevent you from typing any number of characters, which is
	undesirable when doing formatted screen input. This example shows only
	one way to do this. An added feature would be the addition of a
	cursor.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Code Example
	------------
	
	DECLARE SUB BufInput (StringVar$, Limit%)
	'NOTE: The DECLARE statement is not supported under Microsoft
	'      QuickBASIC Version 3.00 or earlier, and can be removed.
	
	CLS
	Limit% = 10 'Number of characters to input
	
	'Prompt for the input string.
	LOCATE 10, 5
	PRINT "PLEASE INPUT A STRING OF TEN CHARACTERS: ";
	COLOR 0, 7: PRINT SPACE$(Limit%)
	LOCATE 10, 46
	
	'Input a buffered string
	CALL BufInput(a$, Limit%)
	
	COLOR 7, 0
	CLS
	
	' Print out the result
	LOCATE 10, 10
	PRINT "THE STRING YOU INPUT WAS: ";
	COLOR 0, 7
	PRINT a$
	COLOR 7, 0
	
	END
	
	SUB BufInput (StringVar$, Limit%)
	BackSp$ = CHR$(8)
	Enter$ = CHR$(13)
	Length% = 0
	
	'Loop waiting for input. ENTER terminates the routine.
	WHILE char$ <> Enter$
	char$ = INKEY$
	   IF char$ <> "" THEN
	     IF (Length% < Limit%) OR (char$ = BackSp$) THEN
	        SELECT CASE char$
	        CASE " " TO "~"  ' Input printable characters only
	           StringVar$ = StringVar$ + char$
	           PRINT char$;
	           Length% = Length% + 1
	        CASE BackSp$  'If BackSpace is pressed, erase.
	          IF Length% <> 0 THEN
	             Length% = Length% - 1
	             StringVar$ = LEFT$(StringVar$, Length%)
	             CurrX% = CSRLIN
	             CurrY% = POS(0) - 1
	             LOCATE CurrX%, CurrY%
	             PRINT " "
	             LOCATE CurrX%, CurrY%
	          END IF
	        END SELECT
	     ELSE
	        PLAY "o1AL32"
	     END IF
	   END IF
	WEND
	
	END SUB
