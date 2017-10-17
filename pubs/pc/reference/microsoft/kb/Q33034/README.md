---
layout: page
title: "Q33034: How to Trap CTRL+BREAK, CTRL+C on Standard &amp; Enhanced Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q33034/
---

## Q33034: How to Trap CTRL+BREAK, CTRL+C on Standard &amp; Enhanced Keyboard

	Article: Q33034
	Version(s): 2.00 2.10 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	The scan code for the BREAK key is &H46 (listed as SCROLL LOCK on Page
	237 of the "Microsoft QuickBASIC 4.0: BASIC Language Reference" manual
	for Versions 4.00 and 4.00b). The CTRL+BREAK key combination is
	trapped differently, depending on whether or not the program is run on
	a standard or enhanced keyboard.
	
	This information also applies to Microsoft QuickBASIC 4.50, Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	For a standard keyboard, CTRL+BREAK is defined as follows
	
	   KEY n, CHR$(&H04) + CHR$(&H46)
	
	where n is in the range 15 through 25 in QuickBASIC Version 4.00, and
	in 15 through 20 in QuickBASIC Versions 2.00, 2.01, and 3.00.
	
	On an enhanced keyboard, CTRL+BREAK is defined as follows:
	
	   KEY n, CHR$(&H84) + CHR$(&H46)
	
	Please note that you must make separate user-defined KEY statements
	for trapping CTRL+BREAK in combination with the SHIFT, ALT, NUM LOCK,
	and CAPS LOCK keys. The keyboard flags for these other key
	combinations must be added together to define a given key sequence.
	
	Examples of trapping CTRL+BREAK and CTRL+C (when the SHIFT, ALT, NUM
	LOCK, or CAPS LOCK keys are NOT active) are shown below.
	
	Code Example 1
	--------------
	
	KEY 15, CHR$(&H84) + CHR$(&H46)  'Traps CTRL+BREAK on enhanced keyboard.
	KEY 16, CHR$(&H4) + CHR$(&H46)   'Traps CTRL+BREAK on standard keyboard.
	KEY(15) ON
	KEY(16) ON
	ON KEY(16) GOSUB trap
	ON KEY(15) GOSUB trap
	FOR i = 1 TO 500
	   PRINT i
	NEXT
	END
	trap:
	   PRINT "trapped"
	   RETURN
	
	Code Example 2
	--------------
	
	Use the following code to trap a CTRL+C on either keyboard (standard
	or extended):
	
	KEY 18, CHR$(&H4)+CHR$(&H2E)    ' The &H4 is the CTRL Key
	KEY (18) ON            ' The &H2E is the C key
	ON KEY(18) GOSUB ctrlctrap
	10 : GOTO 10
	END
	ctrlctrap:
	    PRINT "CONTROL+C Trapped"
	    RETURN
