---
layout: page
title: "Q47754: Can't Trap &quot;String Input When a Numeric Value Is Expected&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q47754/
---

## Q47754: Can't Trap &quot;String Input When a Numeric Value Is Expected&quot;

	Article: Q47754
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom SR# S890711-21
	Last Modified: 18-DEC-1989
	
	The documentation incorrectly states that you can "...safeguard your
	program from user errors such as string input when a numeric value is
	expected..." in the following manuals:
	
	1. "Microsoft QuickBASIC 4.0: Programming in BASIC: Selected Topics"
	   manual for Versions 4.00 and 4.00b, Page 279
	
	2. "Microsoft QuickBASIC 4.5: Programming in BASIC" manual for Version
	   4.50, Page 225
	
	3. "Microsoft BASIC Compiler 6.0: Programming in BASIC: Selected
	   Topics" for Microsoft BASIC Compiler Versions 6.00 and 6.00b, Page
	   279
	
	This documentation error is not present in Microsoft BASIC PDS Version
	7.00.
	
	It is not possible to use the ON ERROR GOTO statement to trap the
	"Redo from Start" error that occurs for the INPUT statement when a
	string is entered and a numeric value is required. To avoid the "Redo
	from Start" error message, you must use a different form of input,
	such as the LINE INPUT statement or the INKEY$ function.
	
	Because LINE INPUT accepts all characters until it encounters a
	carriage return, you must parse the input string yourself using string
	manipulation (e.g. MID$, INSTR) and type conversion (e.g. VAL).
	
	For a code example of a line-input routine using the INKEY$ statement,
	query on the following words:
	
	   INKEY$ and CTRL+BREAK and DEBUG and GOSUB
