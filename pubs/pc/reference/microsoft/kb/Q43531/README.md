---
layout: page
title: "Q43531: INKEY&#36; Does Not Trap Extended Keys; Must Use Softkeys"
permalink: /pubs/pc/reference/microsoft/kb/Q43531/
---

## Q43531: INKEY&#36; Does Not Trap Extended Keys; Must Use Softkeys

	Article: Q43531
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890411-42 B_BasicCom
	Last Modified: 27-DEC-1989
	
	The INKEY$ function does not produce a unique KeyboardFlag + Scancode
	for the extended keys on the enhanced or extended 101-key keyboard.
	For instance, INKEY$ produces the same 2-byte code for the LEFT ARROW
	key on the numeric keypad as for the extended LEFT ARROW key. The same
	applies to the INS, HOME, PGUP, DEL, END, and PGDN keys and to the
	other arrow keys. Thus, you cannot trap for the extended keys
	separately using the INKEY$ function.
	
	This is not a problem with the INKEY$ function. Normally, an
	application's extended keys should behave exactly like the keys'
	equivalents on the numeric keypad. You would expect the cursor to move
	left if you pressed the LEFT ARROW from the numeric keypad or from the
	separate arrow keys.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2, and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2.
	
	To trap the extended keys separately, use the combination of KEY n, ON
	KEY(n), and KEY(n) ON statements. The ability to do this is a unique
	feature of BASIC's key trapping routines. The following code example
	demonstrates how to do this:
	
	Code Example
	------------
	
	'**** NOTE ******
	' For this program to work properly, the NUM LOCK
	' and CAPS LOCK keys must be turned off.
	'****************
	
	' Define softkeys.
	KEY 15, CHR$(&H80) + CHR$(&H4B)
	KEY 16, CHR$(&H0) + CHR$(&H4B)
	
	' Handle key events.
	ON KEY(1) GOSUB terminate
	ON KEY(15) GOSUB keytrap2
	ON KEY(16) GOSUB keytrap1
	
	' Turn the keys on.
	KEY(1) ON
	KEY(15) ON
	KEY(16) ON
	
	' Sign on message.
	CLS
	LOCATE 1, 18
	PRINT "PRESS ONE OF THE LEFT ARROW KEYS"
	LOCATE 2, 20
	PRINT "PRESS F1 TO EXIT THE PROGRAM"
	
	'Loop waiting for keyboard input.
	WHILE 1
	WEND
	
	finish:
	CLS
	
	END
	terminate:
	  RETURN finish
	keytrap1:
	  PRINT "THAT IS THE LEFT ARROW ON THE NUMERIC PAD"
	  RETURN
	keytrap2:
	  PRINT "THAT IS THE EXTENDED LEFT ARROW KEY"
	  RETURN
