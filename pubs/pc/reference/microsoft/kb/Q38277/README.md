---
layout: page
title: "Q38277: LOCATE Must Place Cursor in VIEW PRINT Window or Line 25"
permalink: /pubs/pc/reference/microsoft/kb/Q38277/
---

## Q38277: LOCATE Must Place Cursor in VIEW PRINT Window or Line 25

	Article: Q38277
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 26-FEB-1990
	
	Page 445 of the "Microsoft QuickBASIC 4.00: BASIC Language Reference"
	manual specifies that the LOCATE statement must operate within the
	screen limited by the VIEW PRINT statement. This is true for all lines
	except line number 25. Line 25 is unique; the following explanation
	appears on Page 256 of the same manual:
	
	   The last line on the screen is reserved for the softkey display
	   and is not accessible to the cursor unless the softkey display is
	   off (KEY OFF) and LOCATE is used with PRINT to write on the line.
	
	KEY OFF (softkey display off) is the default. Therefore, even with a
	screen limited from line 4 to line 12, if the command KEY ON has not
	been issued, you may use the LOCATE command to print on line 25.
	
	This information applies to QuickBASIC Versions 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The following is a code example:
	
	   VIEW PRINT 4 TO 12
	   LOCATE 25, 1     ' This LOCATE is OK
	   LOCATE 13, 1     ' This LOCATE is an "Illegal Function Call"
