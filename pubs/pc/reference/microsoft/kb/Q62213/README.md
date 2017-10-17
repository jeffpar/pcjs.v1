---
layout: page
title: "Q62213: How to Get the Current Drive with Microsoft BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q62213/
---

## Q62213: How to Get the Current Drive with Microsoft BASIC

	Article: Q62213
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900517-73 B_BasicCom
	Last Modified: 15-JAN-1991
	
	BASIC programs can call an interrupt to get the currently selected
	drive. The interrupt in question is 21 Hex, function 19 Hex. Before
	calling the interrupt, AH (the upper byte of the AX register) must be
	set to 19 Hex. The interrupt returns the number of the current drive
	in AL (the lower byte of the AX register). The drive numbers
	correspond to the letters of the alphabet (for example, 0 = A, 1 = B,
	etc.).
	
	This information applies to Microsoft QuickBASIC Compiler versions
	4.00, 4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	For more information on interrupt 21 Hex, function 19 Hex, see Page 367
	of "Advanced MS-DOS Programming, Second Edition," by Ray Duncan
	(Microsoft Press, 1988).
	
	Note that BASIC PDS version 7.00/7.10 supports the function "CURDIR$",
	which can also be used to get the currently selected drive. However,
	using this method requires some string parsing. Although the code is
	smaller, it may be slower.
	
	The following sample program reports the current drive:
	
	   'The include file "qb.bi" contains the DECLARE statement for
	   'Interrupt and the TYPE definition for RegType.  If you are
	   'using QBX.EXE, the include file to use is called "qbx.bi".
	
	   '$INCLUDE: 'qb.bi'
	   DIM Regs AS RegType
	
	   'Set AH to 19 Hex:
	   Regs.ax = &H1900
	   'Call the interrupt
	   CALL interrupt(&H21, Regs, Regs)
	
	   'Regs.ax must be ANDed with &HFF so that AH will be cleared.
	   'It must be cleared so the CHR$ function will be passed an
	   'ASCII code in the range of the letters A-Z (65-90).
	   PRINT "The current drive is "; CHR$((Regs.ax AND &HFF) + 65)
	
	   END
