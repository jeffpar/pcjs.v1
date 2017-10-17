---
layout: page
title: "Q64933: How to Emulate INKEY&#36; Function by CALLing MS-DOS INTERRUPT"
permalink: /pubs/pc/reference/microsoft/kb/Q64933/
---

## Q64933: How to Emulate INKEY&#36; Function by CALLing MS-DOS INTERRUPT

	Article: Q64933
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900803-74 B_BasicCom
	Last Modified: 16-AUG-1990
	
	The INKEY$ function in QuickBASIC can be replaced by the following
	code example that uses two MS-DOS interrupt service routines. These
	interrupt routines allow NEWINKEY$ to function the same way that
	INKEY$ works and return the same results for any given keystroke.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and 4.50
	for MS-DOS; to Microsoft BASIC Compiler 6.00 and 6.00b for MS-DOS; and
	to Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	The following code contains the NEWINKEY$ function, which must be
	called from BASIC in the same manner that INKEY$ is called.
	
	'********************************************************************
	'
	'   Written for Microsoft QuickBASIC 4.00, 4.00b, and 4.50; Microsoft
	'   BASIC Compiler 6.00 and 6.00b; and Microsoft BASIC PDS 7.00 and
	'   7.10 for MS-DOS.
	'
	'   This code contains a function (NEWINKEY$) that can be used instead
	'   of the built-in INKEY$ function.
	'
	'   NEWINKEY$ uses two interrupt calls to retrieve information from
	'   the keyboard buffer.
	'
	'   The interrupt (INT) service routines are :
	'   Hexadecimal: INT 16 with Function 11 and INT 16 with Function 10
	'   (Decimal   : INT 22 with Function 17 and INT 22 with Function 16)
	'
	'   For more information regarding the functionality of these and
	'   other interrupts, see "Advanced MS-DOS Programming," second edition,
	'   by Ray Duncan (Microsoft Press, 1988).
	' *********************************************************************
	
	DECLARE FUNCTION NewInkey$ ()
	
	' Use (uncomment) one of the following two INCLUDE statements:
	'
	' The following is the include statement for Microsoft QuickBASIC
	' 4.00, 4.00b, 4.50 or for Microsoft BASIC Compiler 6.00 or 6.00b:
	'
	' REM $INCLUDE: 'QB.BI'
	'
	' The following is the include statement for Microsoft BASIC PDS 7.00
	' or 7.10:
	'
	' REM $INCLUDE: 'QBX.BI'
	
	FUNCTION NewInkey$
	
	   ' RegType is defined in the QB.BI (or QBX.BI) include file
	
	   DIM Regs AS RegType
	
	   ' Register AX will contain 1100 Hexadecimal to specify
	   ' the interrupt function to execute.
	   '
	   ' Function 11 Hexadecimal will get the enhanced keyboard status.
	
	   Regs.ax = &H1100
	   CALL Interrupt(&H16, Regs, Regs)
	
	   KeyCode$ = ""
	
	   ' If the zero flag is clear, then a key was pressed (Bit 6).
	
	   IF (Regs.flags AND 2 ^ 6) = 0 THEN
	
	      ' Call Function 10 Hexadecimal to remove the key from the
	      ' keyboard buffer.
	
	      Regs.ax = &H1000
	      CALL Interrupt(&H16, Regs, Regs)
	
	      Scan% = (Regs.ax AND &HFF00) \ 256 AND &HFF
	      Char% = Regs.ax AND &HFF
	
	      ' Character code of zero is for the special keys (such as
	      ' function keys F1 through F12.
	      ' Character code of 224 is for the Enhanced Keyboard keys (such
	      ' as HOME and END keys)
	
	      IF Char% = 0 OR Char% = 224 THEN
	           KeyCode$ = CHR$(0) + CHR$(Scan%)
	      ELSE
	           KeyCode$ = CHR$(Char%)
	      END IF
	   END IF
	   NewInkey$ = KeyCode$
	END FUNCTION
