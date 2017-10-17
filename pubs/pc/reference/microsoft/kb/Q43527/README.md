---
layout: page
title: "Q43527: BASIC Program to Read Characters from the Screen into a String"
permalink: /pubs/pc/reference/microsoft/kb/Q43527/
---

## Q43527: BASIC Program to Read Characters from the Screen into a String

	Article: Q43527
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-DEC-1989
	
	The program below demonstrates a method to read text that is printed
	on the screen into a BASIC string variable. The program accesses video
	memory (at segment B000 hex) to read the characters from the screen.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00.
	
	For a color display, you must change the address of the DEF SEG
	statement in the function from HEX B000 to HEX B800. Note that any
	attributes (blinking, highlight, etc.) will be lost when the text is
	put into the string.
	
	The program is as follows:
	
	DECLARE FUNCTION readstr$ (xline%, xstart%, xstop%)
	
	CLS
	PRINT "Now is the time"         'Put some text on the screen
	PRINT "for all good men"
	PRINT "to come to the aid"
	PRINT "of their country."
	
	a$ = readstr$(1, 1, 6)          'Read the first six characters of the
	                                'first line  (i.e. "Now is")
	
	b$ = readstr$(4, 10, 18)        'Read the last nine characters (10-18)
	                                'on line four (i.e. "country.")
	LOCATE 10, 1
	PRINT "A$ = "; a$
	PRINT "B$ = "; b$
	
	'readstr$ takes three integers and returns a string.
	'The integers are:    1) The line on the screen to read from
	'                     2) The starting character position
	'                     3) The ending character position
	'It returns a string containing the characters on the screen
	'on the specified line between the start and stop positions.
	'
	FUNCTION readstr$ (xline%, xstart%, xstop%)
	
	  DEF SEG = &HB000              'Change to B800 for color display
	
	  fstart% = (160 * (xline% - 1)) + (2 * (xstart% - 1))
	  fstop% = (160 * (xline% - 1)) + (2 * (xstop% - 1))
	  FOR x% = fstart% TO fstop% STEP 2
	    s$ = s$ + CHR$(PEEK(x%))
	  NEXT x%
	  readstr$ = s$
	END FUNCTION
