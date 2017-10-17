---
layout: page
title: "Q36894: Predefined Key ON KEY(n) GOSUB Trap Supersedes User-Defined"
permalink: /pubs/pc/reference/microsoft/kb/Q36894/
---

## Q36894: Predefined Key ON KEY(n) GOSUB Trap Supersedes User-Defined

	Article: Q36894
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	If a predefined key (such as a key from n=1 through 14) is turned on,
	the associated ON KEY(n) GOSUB statement is executed regardless of the
	status of the keyboardflag. In other words, a predefined key is
	trapped whether or not the key is pressed alone or in conjunction with
	the CAPS LOCK, NUM LOCK, SHIFT, CTRL, or ALT keys. The key trap occurs
	even if the same key also is defined with a specific keyboardflag
	value in a user-defined KEY statement. (User-defined keys are from
	n=15 through 20 in QuickBASIC Versions 3.00 and earlier, and from n=15
	to 25 in QuickBASIC Versions 4.00 and later and BASIC compiler
	Versions 6.00 and 6.00b for MS-DOS and OS/2.)
	
	Unlike trapping predefined keys, trapping user-defined keys IS
	dependent on the status of CAPS LOCK, NUM LOCK, SHIFT, CTRL, or ALT
	key.
	
	In the code example below, the user-defined key trap for CTRL+F1
	initially works as expected. If you press F2 and turn on the trapping
	of predefined function KEY (1), then the user-defined key trap for
	CTRL+F1 is ignored. The ON KEY (1) GOSUB trap for predefined function
	key 1 takes priority. This behavior is by design.
	
	This information applies to all versions of QuickBASIC, to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The following is a code example:
	
	ON KEY(1) GOSUB got1
	KEY(1) OFF
	ON KEY(2) GOSUB swapper
	KEY(2) ON
	KEY 16, CHR$(4) + CHR$(&H3B)
	ON KEY(16) GOSUB got16
	KEY(16) ON
	print "Press an F1, CTRL-F1, or F2 key"
	WHILE 1
	WEND
	END
	
	got16:
	  PRINT "found user-defined CTRL-F1 "
	RETURN
	
	got1:
	  PRINT "found predefined F1 "
	RETURN
	
	swapper:
	   INPUT "set Predefined on (Y/n) ", a$
	   IF a$ = "N" or a$="n" THEN
	      KEY(1) OFF
	   ELSE
	      KEY(1) ON
	   END IF
	RETURN
