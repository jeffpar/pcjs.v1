---
layout: page
title: "Q59725: INTERRUPT for Clock Tick Counter Returns Negative Value"
permalink: /pubs/pc/reference/microsoft/kb/Q59725/
---

## Q59725: INTERRUPT for Clock Tick Counter Returns Negative Value

	Article: Q59725
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900222-218 B_BasicCom
	Last Modified: 26-MAR-1990
	
	Interrupt 1A Hex, with Function 0, returns the current value of the
	clock tick counter in registers CX and DX. When the low-order portion
	of the clock tick counter (returned in DX) exceeds 32,767, it becomes
	negative when stored as an integer in BASIC, because 32,767 is the
	maximum value for a 2-byte signed integer. Below is an example to
	convert the negative value to the equivalent unsigned long integer
	value.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS.
	
	For a more complete description of converting negative signed integers
	to unsigned integers, query on the following words:
	
	   CALL and INTERRUPT and negative and signed and integer
	
	The following QuickBASIC program outputs only positive values by
	removing the sign bit and adding the remaining number plus 1 to
	32,767:
	
	' $INCLUDE: 'qb.bi'
	REM  In BASIC 7.00, use $INCLUDE: 'qbx.bi' instead of 'qb.bi'.
	REM  To use CALL INTERRUPT in this program, you must do the following:
	REM  If you run this program in QB.EXE, use QB /L QB.QLB.
	REM  If you run this program in QBX.EXE, use QBX /L QBX.QLB.
	REM  LINK with QB.LIB (or QBX.LIB for BASIC 7.00).
	
	DIM inregs AS regtype, outregs AS regtype
	LOCATE 23, 1: PRINT "Push any key to end program."
	DO
	inregs.ax = 0
	CALL interrupt(&H1A, inregs, outregs)
	high& = outregs.cx
	low& = outregs.dx
	IF low& < 0 THEN              'if the low-order portion is negative:
	  low& = low& AND &H7FFF      'remove sign bit
	  low& = low& + &H7FFF + 1    'add remaining number plus 1 to 32,767
	END IF
	LOCATE 24, 1: PRINT high&; ":"; low&; "   ";
	LOOP UNTIL INKEY$ <> ""
	END
