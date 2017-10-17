---
layout: page
title: "Q65886: TAB() Function Is Affected by Nonprinting Control Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q65886/
---

## Q65886: TAB() Function Is Affected by Nonprinting Control Characters

	Article: Q65886
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900916-2 B_BasicCom B_GWBasicI B_BasicInt
	Last Modified: 8-NOV-1990
	
	Sending control characters to a device in conjunction with the TAB()
	function may result in output not appearing as desired. This is
	because the TAB() function does not distinguish what is and what is
	not a control character. This behavior is due to the fact that control
	characters and escape sequences are device and hardware specific but
	the TAB() function treats them like any other character.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, 4.50 for MS-DOS
	
	2. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS OS/2 and
	   MS-DOS
	
	3. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2
	
	4. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, 3.23 for MS-DOS
	
	The TAB() function is a device I/O function that moves the print
	position when used in the PRINT, PRINT #, and LPRINT statements. The
	position it moves to is based on how many characters have been sent to
	the file or device.
	
	When you send ASCII text data to a file or device, TAB() functions as
	desired. But when you send control characters or escape sequences
	(that may be device or hardware specific), the TAB() function counts
	these characters along with the other characters, which results in the
	desired print position being off by the number of "nonprinting"
	control characters sent. This device-independent behavior of TAB() is
	by design.
	
	To work around this behavior, the program must keep track of the
	current print position and/or the number of control characters sent.
	When keeping track of the current print position, the program can then
	use the SPACE$() or SPC() function to move to the desired position.
	When keeping track of the number of control characters sent, the
	desired column of the TAB() function can be added to the number of
	control characters sent to get the desired print position. The
	following code examples demonstrate both methods.
	
	Example 1
	---------
	
	This example uses the variable CTRLCHARS to keep track of the control
	characters sent for a given line of text, and puts it in the TAB()
	function when evaluating how far to move over:
	
	   10 LPRINT CHR$(27) + CHR$(52)    'SET EPSON PRINTER IN ITALIC MODE
	   20 CTRLCHARS = 2
	   30 LPRINT TAB(10 + CRTLCHARS) "HELLO"    'PRINT HELLO ON LINE 10
	
	Example 2
	---------
	
	This example uses the SPACE$() function to move the print position to
	the desired column:
	
	   10 LPRINT CHR$(27) + CHR$(52)    'SET EPSON PRINTER IN ITALIC MODE
	   20 LPRINT SPACE$(10); "HELLO"    'SPACE OVER 10 PLACES AND PRINT HELLO
