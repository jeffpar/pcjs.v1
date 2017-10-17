---
layout: page
title: "Q31157: Use PRINT# to MS-DOS &quot;CON&quot; Device to Send ANSI Escape Codes"
permalink: /pubs/pc/reference/microsoft/kb/Q31157/
---

## Q31157: Use PRINT# to MS-DOS &quot;CON&quot; Device to Send ANSI Escape Codes

	Article: Q31157
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 22-JAN-1990
	
	Sending ANSI escape codes to the screen with the PRINT statement will
	not perform ANSI screen control because the PRINT statement (in the
	products below) circumvents DOS and its device drivers.
	
	To make ANSI escape sequences work properly, you must OPEN the DOS
	"CON" or "CONS:" (console) device instead, and use PRINT# for output.
	
	This information applies to the following products:
	
	1. QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00,
	   4.00b, and 4.50 for IBM Personal Computers and Compatibles
	
	2. Microsoft BASIC Compiler Version 6.00 and 6.00b for MS-DOS
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	4. GW-BASIC Versions 3.20, 3.21, 3.22, 3.23
	
	5. IBM and Compaq versions of BASICA
	
	To make ANSI control characters work properly, do the following:
	
	1. Obtain the file ANSI.SYS from the DOS release disk. Put it on the
	   root directory of your boot disk.
	
	2. Put the statement DEVICE=ANSI.SYS in the CONFIG.SYS file on the
	   root directory of the boot disk.
	
	3. Reboot. If the message "ANSI.SYS Not Found" displays, the ANSI
	   control codes will not work.
	
	4. In your BASIC program, OPEN the DOS "CON" (console) device for
	   output as #n.
	
	5. Use PRINT#n to send output to the DOS "CON" (console) device.
	
	6. CLOSE#n at the end of the program.
	
	For a list of the ANSI escape sequences, refer to the following:
	
	1. The "Microsoft MS-DOS Version 3.20 User's Reference," Appendix C
	   "Installable Device Drivers"
	
	2. IBM PC-DOS technical reference manual
	
	The following code demonstrates how to use ANSI screen control codes
	from BASIC:
	
	'The following example changes the background
	'and foreground color of the screen, sets blinking and bold characters,
	'and positions the cursor:
	CLS
	escape$ = CHR$(27) + "["
	attriboff$ = escape$ + "0m"
	blinkon$ = "5m"
	bold$ = "1m"
	reversv$ = "7m"
	red$ = "41m"
	green$ = "42m"
	blue$ = "44m"
	blackback$ = "40m"
	x = 30
	y = 10
	rowcol$ = MID$(STR$(y), 2) + ";" + MID$(STR$(x), 2) + "H"
	OPEN "CON" FOR OUTPUT AS 1
	PRINT #1, attriboff$;
	PRINT #1, escape$ + rowcol$ + "Locate the cursor with ansi.sys"
	PRINT #1, attriboff$;
	PRINT #1, escape$ + blinkon$ + "Blinking" + attriboff$;
	PRINT #1, escape$ + bold$ + "Bold" + attriboff$;
	PRINT #1, escape$ + reversv$ + "reverse"
	PRINT #1, escape$ + red$ + "red"
	PRINT #1, escape$ + green$ + "green"
	PRINT #1, escape$ + blue$ + "blue"
	CLOSE #1
