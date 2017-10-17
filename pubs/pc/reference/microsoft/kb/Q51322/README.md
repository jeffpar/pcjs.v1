---
layout: page
title: "Q51322: BASIC INPUT and LINE INPUT Always Turn on Cursor during Input"
permalink: /pubs/pc/reference/microsoft/kb/Q51322/
---

## Q51322: BASIC INPUT and LINE INPUT Always Turn on Cursor during Input

	Article: Q51322
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890919-120  B_BasicCom B_GWBasicI
	Last Modified: 19-DEC-1989
	
	The INPUT and LINE INPUT statements always turn on the cursor when
	they are executed. Turning off the cursor beforehand with the LOCATE
	statement will not turn off the INPUT or LINE INPUT cursor. If the
	LOCATE statement turned off the cursor before the INPUT or LINE INPUT
	statement, the cursor will be off after input is completed. But
	during execution of INPUT or LINE INPUT, the cursor remains on.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, Microsoft
	BASIC Compiler Versions 6.00, and 6.00b for MS-DOS and MS OS/2,
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2, and to
	Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23 for
	MS-DOS.
	
	If you want a form of input that has no automatic cursor, you can
	invoke the LOCATE statement to turn off the cursor and use the INKEY$
	function in a loop to accept input character by character. For an
	example of using INKEY$ to input a fixed number of characters in a
	loop, query on the following words:
	
	   buffered and INKEY$ and keyboard and INPUT and LOCATE
	
	The following code example demonstrates the visibility of the cursor
	when using the INPUT statement. The results are the same for the LINE
	INPUT statement.
	
	Code Example
	------------
	
	LOCATE 1,1,0         'Turn cursor off
	INPUT a$             'Cursor will come back on
	PRINT a$             'Cursor will be off again
	while inkey$="" : wend   ' Wait for any keystroke.
