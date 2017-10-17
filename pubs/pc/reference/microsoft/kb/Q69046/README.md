---
layout: page
title: "Q69046: Predefined Keys Trap All SHIFT Combinations; PEEK SHIFT Status"
permalink: /pubs/pc/reference/microsoft/kb/Q69046/
---

## Q69046: Predefined Keys Trap All SHIFT Combinations; PEEK SHIFT Status

	Article: Q69046
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910117-124 B_BASICCOM
	Last Modified: 6-FEB-1991
	
	The predefined key traps KEY(0) through KEY(14), KEY(30), and KEY(31)
	are active no matter what combinations of the SHIFT, CTRL, ALT, CAPS
	LOCK, and NUM LOCK keys are active. If you want to distinguish and
	trap both the SHIFTed and unSHIFTed status for a given key, you must
	either set up two user-defined key traps, or check the contents of the
	SHIFT register while the predefined key is being trapped.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS.
	
	The following program demonstrates that even though a user-defined key
	trap, ON KEY(15), is activated for the SHIFT+DOWN ARROW key
	combination, the trap is never executed because the predefined DOWN
	ARROW key trap, ON KEY(14), takes precedence:
	
	Code Example 1
	--------------
	
	KEY 15, CHR$(3) + "P"
	ON KEY(15) GOSUB ShiftArrow
	KEY(15) ON
	ON KEY(14) GOSUB DownArrow
	KEY(14) ON
	CLS
	DO
	   a$ = INKEY$
	LOOP UNTIL a$ = "q"
	
	KEY(15) OFF
	KEY(14) OFF
	END
	ShiftArrow:
	   PRINT "Shift-Down arrow..."
	   RETURN
	DownArrow:
	   PRINT "Down arrow..."
	   RETURN
	
	The next program demonstrates how to use the PEEK function to
	determine if the SHIFT key is currently being pressed when the key
	trap occurs:
	
	Code Example 2
	--------------
	
	ON KEY(14) GOSUB ArrowKey
	KEY(14) ON
	CLS
	DO
	    a$ = INKEY$
	LOOP UNTIL a$ = "q"
	KEY(14) OFF
	END
	ArrowKey:
	    DEF SEG = 0
	    IF (PEEK(1047) AND 3) = 0 THEN
	         PRINT "Down arrow..."
	    ELSE
	         PRINT "Shift-Down arrow..."
	    END IF
	    DEF SEG
	    RETURN
	
	The disadvantage of the method in example 2 is that if anything should
	happen to delay the time between the key press and the time that the
	trap routine is called (for example, if an INPUT statement is being
	executed when the key is pressed), then the user may release the SHIFT
	key before it can be detected.
	
	The last option is to invoke a user-defined key trap for both the
	SHIFTed and unSHIFTed keys; and not to use the predefined key trap.
	
	Reference:
	
	For more information on this topic, query on the following words:
	
	   key and trap and CAPS and NUM and LOCK and user and defined
