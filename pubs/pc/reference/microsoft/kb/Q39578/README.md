---
layout: page
title: "Q39578: CHR&#36;(0) PRINTs As Space to Screen; LPRINTs Nothing to Printer"
permalink: /pubs/pc/reference/microsoft/kb/Q39578/
---

## Q39578: CHR&#36;(0) PRINTs As Space to Screen; LPRINTs Nothing to Printer

	Article: Q39578
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881212-23
	Last Modified: 21-DEC-1988
	
	CHR$(0) (a null byte) is a non-printable character in MS-DOS. However,
	the PRINT and PRINT USING statements in BASIC print this character as
	a space.
	
	Sending CHR$(0) to the following MS-DOS logical device names will
	print nothing:
	
	  "CONS:"
	  "LPTn:"
	  "COMn:"
	  "SCRN:"
	
	Likewise, printing CHR$(0) with the LPRINT or LPRINT USING statements
	sends nothing.
	
	Fixed-length strings are initialized to null bytes. Printing these
	fixed-length strings to the screen and to the printer will give
	different column alignment. This difference can be circumvented by
	using the STRING$() function to initialize the fixed length string
	with spaces.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, and to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2.
	
	The following is a code example:
	
	'The following piece of code will print an uninitialized fixed-length
	'string to the screen and printer using the PRINT and LPRINT
	'statements. Unless the STRING$() function is used to fill the
	'fixed-length string with spaces, the hard copy and screen will show
	'different column alignment.
	TYPE aType
	  Field1 AS STRING * 32    ' a fixed length string
	END TYPE
	DIM aVariable AS aType
	CLS
	' Comment out the following line to cause different column alignment
	' between LPRINT and PRINT; otherwise columns will line up the same:
	aVariable.Field1 = STRING$(32, " ")
	
	' Use LPRINT:
	FOR i = 1 TO 10: LPRINT : NEXT i
	LPRINT "printing aVariable.Field1 to printer with 'xxxx' following"
	LPRINT "1234567890123456789012345678901234567890"
	LPRINT aVariable.Field1; "xxxx"
	LPRINT "printing aVariable.Field1 with LPRINT USING '\     \xxxx'"
	LPRINT USING "\     \xxxx"; aVariable.Field1
	FOR i = 1 TO 10: LPRINT : NEXT i
	
	' Use PRINT:
	PRINT "printing aVariable.Field1 to screen with 'xxxx' following"
	PRINT "1234567890123456789012345678901234567890"
	PRINT aVariable.Field1; "xxxx"
	PRINT "printing aVariable.Field1 with PRINT USING '\     \xxxx'"
	PRINT USING "\     \xxxx"; aVariable.Field1
