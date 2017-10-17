---
layout: page
title: "Q32788: Example of Trapping CTRL+ALT+DEL Keys in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q32788/
---

## Q32788: Example of Trapping CTRL+ALT+DEL Keys in QuickBASIC

	Article: Q32788
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 22-DEC-1989
	
	The correction below applies to the KEY statement on Page 236 of the
	following manuals:
	
	1. Page 236 of "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	   for Versions 4.00 and 4.00b
	
	2. Page 236 of "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" for Versions 6.00 and 6.00b for MS-DOS and MS OS/2
	
	3. Page 180 of the "Microsoft BASIC 7.0: Language Reference" manual
	   for Microsoft BASIC PDS Version 7.00
	
	4. Page 198 of the "Microsoft QuickBASIC: BASIC Language Reference" manual
	   for QuickBASIC Version 4.50
	
	The following phrase for the KEY(n) statement is incorrect:
	
	   ...a keyboardflag value of &H12 would test for both CTRL and ALT
	   being pressed.
	
	The keyboardflag value should be &H0C on a non-extended keyboard, not
	&H12, to test for both CTRL and ALT being pressed. The keyboardflag
	value should be &H8C on an extended keyboard. This example incorrectly
	uses decimal addition on hexadecimal numbers.
	
	The following BASIC program gives an example of trapping the
	CTRL+ALT+DEL key sequence for both extended and non-extended
	keyboards:
	
	  ' This example works in QuickBASIC Versions 4.00 and later.
	  ' &H80 = keyboard flag value to add for extended keyboard keys
	  ' &H0C = keyboard flag for CTRL (&H04) plus ALT (&H08), pressed
	  '        together.
	  ' &H53 = scan code for DELETE (or DEL) key
	  CLS
	  KEY 15, CHR$(&HC) + CHR$(&H53)    '   Trap CTRL+ALT+DEL for
	  ON KEY(15) GOSUB ctrlaltdelwhite  '   white DEL key
	  KEY(15) ON
	  KEY 16, CHR$(&H8C) + CHR$(&H53)   '   Trap CTRL+ALT+DELETE for
	  ON KEY(16) GOSUB ctrlaltdelgrey   '   grey (extended) DELETE key
	  KEY(16) ON
	  DO
	  LOOP UNTIL INKEY$ = "q"         '  Idle loop
	  END
	ctrlaltdelgrey:
	  PRINT "pressed CTRL+ALT+DELETE (grey DELETE key) on extended keyboard"
	  RETURN
	ctrlaltdelwhite:
	  PRINT "Pressed CTRL+ALT+DEL (white DEL key) on either keyboard"
	  RETURN
	
	Please note that when you run this program, pressing CTRL+ALT+DEL will
	reboot the computer if any of the following key states are also
	active:
	
	   SHIFT, NUM LOCK, or CAPS LOCK
	
	You must define separate ON KEY(n) statements for trapping
	CTRL+ALT+DEL in combination with the different states of the SHIFT,
	NUM LOCK, or CAPS LOCK keys. In the ON KEY(n) statement, n can be 15
	through 25; this limits you to 11 user-defined keys.
	
	The keyboardflag value &H0C in the KEY statement is obtained by adding
	together the keyboardflag values from Page 236 for the CTRL and ALT
	keys, as in the following example:
	
	      &H04   +  &H08   =>  &H0C
	      (CTRL)    (ALT)      (keyboardflag for KEY statement)
	
	When adding together keyboardflag values to trap different
	combinations of SHIFT, CTRL, ALT, NUM LOCK, CAPS LOCK, or
	Advanced-101-keyboard extended keys, it is important to remember that
	the values on Page 236 are in hexadecimal (base 16) notation, where
	numbers are preceded with &H. If you wish, you can convert the number
	to decimal notation (base 10) and use that value. Be sure not to use
	&H in front of the value in BASIC if the value is in decimal notation.
