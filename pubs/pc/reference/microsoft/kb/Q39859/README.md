---
layout: page
title: "Q39859: CALL INTERRUPT 25H Doesn't Return Error Flags in the AX Reg"
permalink: /pubs/pc/reference/microsoft/kb/Q39859/
---

## Q39859: CALL INTERRUPT 25H Doesn't Return Error Flags in the AX Reg

	Article: Q39859
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881216-23
	Last Modified: 14-DEC-1989
	
	Microsoft QuickBASIC supports the CALL INTERRUPT and CALL INTERRUPTX
	statements for calling MS-DOS and ROM BIOS functions/interrupts. The
	Interrupt Hex 25 is used to perform an absolute read from disk to a
	memory location. If there are any errors during this operation, the
	interrupt will return them in the AH register.
	
	If the CALL INTERRUPT or CALL INTERRUPTX are used to execute Interrupt
	25 Hex, the correct error code is not returned. This problem occurs
	because Interrupt 25H does not POP the CPU flags from the stack after
	its operation; these are flags the INT 25 Hex function originally
	PUSHed onto the stack. Therefore, when INTERRUPTX returns to
	QuickBASIC, it returns the "old" flags. These do not reflect the
	Interrupt 25 Hex function-flag return. Most MS-DOS and ROM BIOS
	interrupts do POP the CPU flags from the stack upon completion and
	this problem does not exist. INTERRUPTX does not compensate for the
	extra set of flags on the stack.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS
	and MS OS/2, and Microsoft BASIC PDS 7.00 for MS-DOS and OS/2.
	
	The two workarounds for this problems are as follows:
	
	1. Call an assembly-language subroutine that performs the Interrupt 25
	   Hex. The correct flags will be directly accessible by the
	   subroutine and can then be cleared with a POPF or ADD SP,2
	   instruction. More information on this can be found on Pages 388-389
	   of "Advanced MS-DOS" by Ray Duncan (published by Microsoft Press,
	   1986).
	
	OR
	
	2. Call a different but very similar interrupt as follows:
	
	      Interrupt 13 Hex  Function 02 Hex
	
	   This is not an MS-DOS function, but rather a ROM BIOS interrupt,
	   which (unlike Interrupt 25 Hex) does its own stack clearing. This
	   is described below.
	
	In the following programs, Prog1 demonstrates the problem. No matter
	what Interrupt 25 Hex error occurs, the AX flags are always returned
	the same. Prog2 follows the second workaround described above and uses
	the Interrupt 13 Hex, which will return the proper error flags.
	
	Prog1 is as follows:
	
	'The include file below needs to be 'QBX.BI' when using
	'BASIC PDS 7.00 and the Quick library is QBX.QLB.
	
	'$INCLUDE: 'QB.BI'
	DEFINT A-Z
	DIM InRegs AS RegTypeX, OutRegs AS RegTypeX
	DIM buffit(1 TO 8000)  AS INTEGER
	CLS
	InRegs.ax = &H0
	InRegs.cx = &H0
	InRegs.dx = &H0
	InRegs.ds = VARSEG(buffit(1))
	InRegs.bx = VARPTR(buffit(1))
	CALL INTERRUPTX(&H25, InRegs, OutRegs)
	PRINT OutRegs.ax
	END
	
	Prog2 is as follows:
	
	'The include file below needs to be 'QBX.BI' when using
	'BASIC PDS 7.00
	
	'$INCLUDE: 'QB.BI'
	DEFINT A-Z
	DIM InRegs AS RegTypeX, OutRegs AS RegTypeX
	DIM buffit(1 TO 8000)  AS INTEGER
	CLS
	InRegs.ax = &H201
	InRegs.cx = &H1
	InRegs.dx = &H0
	InRegs.es = VARSEG(buffit(1))
	InRegs.bx = VARPTR(buffit(1))
	CALL INTERRUPTX(&H13, InRegs, OutRegs)
	PRINT OutRegs.ax
	END
