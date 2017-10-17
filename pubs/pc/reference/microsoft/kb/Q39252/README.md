---
layout: page
title: "Q39252: ON KEY Trapping CTRL, SHIFT, CAPS LOCK, NUM LOCK Combinations"
permalink: /pubs/pc/reference/microsoft/kb/Q39252/
---

## Q39252: ON KEY Trapping CTRL, SHIFT, CAPS LOCK, NUM LOCK Combinations

	Article: Q39252
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 5-SEP-1990
	
	Pressing any key in combination with CTRL, SHIFT, ALT, CAPS LOCK, or
	NUM LOCK changes the keyboard scan code. To trap combinations of keys,
	the KEY statement requires adding together the values of the keyboard
	flags as shown in the code example below.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The following is a code example:
	
	   CONST alt = &H8
	   CONST noflag = &H0
	   CONST leftshift = &H1
	   CONST rightshift = &H2
	   CONST ctrl = &H4
	   CONST numlock = &H20
	   CONST capslock = &H40
	   CONST extendedkeyboard = &H80
	   CONST left = &H4B
	   CONST right = &H4D
	   CONST up = &H48
	   CONST down = &H50
	   CONST C = &H2E
	   CONST scrolllock = &H46
	
	   KEY 15, CHR$(extendedkeyboard + numlock) + CHR$(left)
	   KEY 16, CHR$(extendedkeyboard + numlock) + CHR$(right)
	   KEY 17, CHR$(extendedkeyboard + numlock) + CHR$(up)
	   KEY 18, CHR$(extendedkeyboard + numlock) + CHR$(down)
	   KEY 19, CHR$(ctrl + capslock) + CHR$(C)
	   KEY 20, CHR$(extendedkeyboard + ctrl + numlock) + CHR$(scrolllock)
	
	   ON KEY(15) GOSUB left
	   ON KEY(16) GOSUB right
	   ON KEY(17) GOSUB up
	   ON KEY(18) GOSUB down
	   ON KEY(19) GOSUB break
	   ON KEY(20) GOSUB break
	
	   KEY(15) ON
	   KEY(16) ON
	   KEY(17) ON
	   KEY(18) ON
	   KEY(19) ON
	   KEY(20) ON
	
	   WHILE UCASE$(INKEY$) <> UCASE$("q")
	   WEND
	   END
	
	   left:
	    PRINT "left"
	   RETURN
	
	   right:
	    PRINT "right"
	   RETURN
	
	   up:
	    PRINT "up"
	   RETURN
	
	   down:
	    PRINT "down"
	   RETURN
	
	   break:
	    PRINT "break"
	   RETURN
