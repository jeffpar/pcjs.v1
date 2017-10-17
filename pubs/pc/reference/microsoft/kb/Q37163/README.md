---
layout: page
title: "Q37163: How to INPUT Text without CTRL+BREAK Stopping Execution"
permalink: /pubs/pc/reference/microsoft/kb/Q37163/
---

## Q37163: How to INPUT Text without CTRL+BREAK Stopping Execution

	Article: Q37163
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	When an INPUT or LINE INPUT statement is pending to accept text, the
	program will always stop if you press CTRL+BREAK. CTRL+BREAK aborts
	the program even when the program is compiled without the /D (debug)
	option. [Pressing CTRL+BREAK will not stop programs compiled without
	/D (debug) if no INPUT or LINE INPUT statement is currently pending.]
	
	Also, events such as ON KEY(n) GOSUB key trapping and ON ERROR GOTO
	error handling are suspended until the INPUT or LINE INPUT statement
	is satisfied by pressing the ENTER key.
	
	This behavior applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50; to Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2; and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	You will need to use a method other than INPUT and LINE INPUT to both
	suppress CTRL+BREAK and allow input, and to allow events to be handled
	while input is taking place. The easiest method to use is a loop
	structure that monitors the value of the INKEY$ function and makes the
	appropriate changes to the input string. Below is an example of how to
	write your own INPUT statement. For another example of how to write
	your own INPUT statement, query on the following words:
	
	   QuickBASIC and buffered and keyboard and input and cursor
	
	The program listing below demonstrates how to use INKEY$ in a loop to
	simulate the operation of INPUT or LINE INPUT. The program checks the
	value of INKEY$, and acts on the value accordingly, such as handling
	backspaces, carriage returns, and non-printable characters. This
	routine can easily be modified to allow other features, such as
	filling the edit field to the specified size with a fill character,
	recognizing function keys to perform various functions, etc.
	
	THe following is a code example:
	
	'--- INPUT.BAS
	'--- Copyright (c) 1988 Microsoft Corporation
	'--- This program demonstrates the subprogram TextInput as a
	'--- substitute for BASIC's INPUT and LINE INPUT statements.
	'--- When compiled without the /D (debug) option, pressing
	'--- CTRL+BREAK will not stop this program.
	DECLARE SUB TextInput (text$, MaxLen%)
	text$ = "This is a sample"
	PRINT "Enter some text:";
	TextInput text$, 45
	PRINT "The line you entered:"
	PRINT text$
	END
	
	'--- TextInput
	'--- Accepts a line of text from the user
	'
	'--- Text$   : Default string/destination string input by user
	'--- MaxLen% : Maximum length of destination string, up to 80 chars
	'
	SUB TextInput (text$, MaxLen%) STATIC
	  '--- Set up cursor, line, and maximum characters to enter:
	  y% = CSRLIN
	  LOCATE , , 1
	  IF MaxLen% > (79 - POS(0)) THEN MaxLen% = (79 - POS(0))
	  '--- Display default text:
	  PRINT text$;
	  '--- Do the input loop:
	  DO
	    i$ = INKEY$
	    SELECT CASE LEFT$(i$, 1)
	      CASE CHR$(8)                      '--- Handle a backspace
	        IF text$ > "" THEN
	          text$ = LEFT$(text$, LEN(text$) - 1)
	          LOCATE y%, POS(0) - 1
	          PRINT " ";
	          LOCATE , POS(0) - 1
	        END IF
	      CASE CHR$(32) TO CHR$(255)        '--- Valid characters
	        IF LEN(text$) <= MaxLen% THEN
	          PRINT LEFT$(i$, 1);
	          text$ = text$ + LEFT$(i$, 1)
	        ELSE
	          BEEP
	        END IF
	      CASE "", CHR$(13)                 '--- Null or carriage return
	      CASE ELSE                         '--- Non-printables, etc.
	        BEEP
	    END SELECT
	  LOOP UNTIL i$ = CHR$(13)
	  LOCATE , , 0
	  PRINT
	END SUB
