---
layout: page
title: "Q59131: How to Trap CTRL, ALT, and SHIFT Keys Alone in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q59131/
---

## Q59131: How to Trap CTRL, ALT, and SHIFT Keys Alone in BASIC

	Article: Q59131
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900223-10 B_BasicCom
	Last Modified: 28-FEB-1990
	
	Normally, to trap CTRL (CONTROL), ALT, and SHIFT in combination with
	other keys, you would set the bits for these keys in the first byte
	(keyboard flag) of the two CHR$() bytes in the KEY statement.
	
	However, to trap the CTRL, ALT, and SHIFT keys alone (not in
	combination with other keys), the keyboard flag in the KEY statement
	should be CHR$(0) for the standard keyboard or CHR$(&H80) for keys
	specific to an extended keyboard.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The syntax of the KEY statement (where n=15 through 25 can be
	user-defined keys) is as follows:
	
	   KEY n, CHR$(keyboardflag) + CHR$(scancode)
	
	The following table lists the scan codes for the CTRL, ALT and SHIFT
	keys:
	
	   Key           Scan Code
	   ---           ---------
	   CTRL          &H1D
	   ALT           &H38
	   LEFT SHIFT    &H2A
	   RIGHT SHIFT   &H36
	
	NOTE: To trap the RIGHT CTRL or RIGHT ALT key (found only on an
	extended 101 keyboard), the extended keyboard flag (&H80) must be used
	in the keyboard flag byte.
	
	Code Example
	------------
	
	The following code example traps the CTRL, ALT, and SHIFT keys
	alone:
	
	'NOTE:  This program requires NUM LOCK and CAPS LOCK to be off.
	KEY 15, CHR$(&H0) + CHR$(&H1D)      'LEFT CTRL (on
	ON KEY(15) GOSUB Ctrl               'Standard or Extended keyboard)
	KEY(15) ON
	
	KEY 16, CHR$(&H80) + CHR$(&H1D)     'RIGHT CTRL (on Extended keyboard)
	ON KEY(16) GOSUB Ctrl
	KEY(16) ON
	
	KEY 17, CHR$(&H0) + CHR$(&H38)      'LEFT ALT (on
	ON KEY(17) GOSUB alt                'Standard or Extended keyboard)
	KEY(17) ON
	
	KEY 18, CHR$(&H80) + CHR$(&H38)     'RIGHT ALT (on Extended keyboard)
	ON KEY(18) GOSUB Alt
	KEY(18) ON
	
	KEY 19, CHR$(&H0) + CHR$(&H2A)      'LEFT SHIFT (on
	ON KEY(19) GOSUB Shift              'Standard or Extended keyboard)
	KEY(19) ON
	
	KEY 20, CHR$(&H0) + CHR$(&H36)      'RIGHT SHIFT (on
	ON KEY(20) GOSUB Shift              'Standard or Extended keyboard)
	KEY(20) ON
	
	WHILE INKEY$ <> CHR$(27): WEND      'Press ESC to end
	END
	
	Ctrl: PRINT "CTRL"
	RETURN
	
	Alt:  PRINT "ALT"
	RETURN
	
	Shift:  PRINT "SHIFT"
	RETURN
