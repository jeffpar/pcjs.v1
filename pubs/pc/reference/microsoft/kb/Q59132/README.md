---
layout: page
title: "Q59132: How to Disable Toggle for NUM/CAPS/SCROLL LOCK with Key Trap"
permalink: /pubs/pc/reference/microsoft/kb/Q59132/
---

## Q59132: How to Disable Toggle for NUM/CAPS/SCROLL LOCK with Key Trap

	Article: Q59132
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900222-212 B_BasicCom SCROLLLOCK NUMLOCK CAPSLOCK
	Last Modified: 26-MAR-1990
	
	By setting up key traps for the NUM LOCK, CAPS LOCK, and SCROLL LOCK
	keys, a BASIC program can prevent the toggling of each of these key
	states. This is extremely useful for trapping other keys because the
	program can limit the number of keys to be defined.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	The syntax of the KEY statement (where n=15 through 25 can be
	user-defined keys) is as follows:
	
	   KEY n, CHR$(keyboardflag) + CHR$(scancode)
	
	The following are the scan codes are for the CAPS LOCK, NUM LOCK, and
	SCROLL LOCK keys:
	
	   Key           Scan Code
	   ---           ---------
	   CAPS LOCK     &H3A
	   NUM LOCK      &H45
	   SCROLL LOCK   &H46
	
	By defining traps for NUM LOCK and CAPS LOCK, your program can
	effectively reduce (by a factor of four) the number of keys needed to
	be defined. For example, to trap both the CTRL+ALT+DEL and CTRL+BREAK
	combinations, 16 keys must be created to handle all the different
	combinations. This is more than the maximum number of user-defined
	keys (11). By defining CAPS and NUM LOCK traps, only 4 additional keys
	must be defined.
	
	To see how to programmatically (without pressing the key) force the
	NUM LOCK, CAPS LOCK, or SCROLL LOCK state on or off, query on the
	following words to find a separate article in this Knowledge Base:
	
	   KEY and POKE and CAPS
	
	Code Example
	------------
	
	The following code example disables the toggles for the CAPS LOCK,
	NUM LOCK, and SCROLL LOCK keys:
	
	'NOTE: This program assumes NUM LOCK and CAPS LOCK are off at the
	'      beginning. See the article referenced above for how to set
	'      the NUM and CAPS LOCK off.
	KEY 15, CHR$(&H0) + CHR$(&H3A)       'CAPS LOCK
	ON KEY(15) GOSUB caps
	KEY(15) ON
	
	KEY 16, CHR$(&H0) + CHR$(&H45)       'NUM LOCK
	ON KEY(16) GOSUB num
	KEY(16) ON
	
	KEY 17, CHR$(&H0) + CHR$(&H46)       'SCROLL LOCK
	ON KEY(17) GOSUB scroll
	KEY(17) ON
	
	WHILE INKEY$ <> CHR$(27): WEND
	END
	
	caps: PRINT "NO CAPS LOCK TOGGLE!"
	RETURN
	
	num:  PRINT "NO NUM LOCK TOGGLE!"
	RETURN
	
	scroll:  PRINT "NO SCROLL LOCK TOGGLE!"
	RETURN
