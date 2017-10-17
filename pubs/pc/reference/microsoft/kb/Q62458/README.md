---
layout: page
title: "Q62458: How to Find All Available Logical Drives in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q62458/
---

## Q62458: How to Find All Available Logical Drives in BASIC

	Article: Q62458
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900521-38 B_BasicCom
	Last Modified: 29-JAN-1991
	
	A BASIC program can call interrupts to find out which logical drives
	are available. The interrupts used are 21Hex, function 0EHex (Select
	disk) and 21Hex, function 19Hex (Get current disk). The method
	involves circulating through each possible logical drive (A-Z) and
	calling the interrupt to select that drive. If this is successful,
	subsequently calling the interrupt to get the current drive should
	return that same drive. If it isn't the same, the drive wasn't
	successfully selected and therefore isn't available.
	
	This information applies to Microsoft QuickBASIC Compiler versions
	4.00, 4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS, and Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Function 0EH of interrupt 21H (Select disk) requires input from the
	following registers:
	
	   AH (upper byte of AX) = 0EH
	   DL (lower byte of DX) = drive code (0=A, 1=B, etc.)
	
	When called, it makes the drive passed in DL current, if possible. If
	that drive is not available, the interrupt does not return an error.
	That is why function 19H of interrupt 21H (Get current disk) must be
	called to see if function 0EH was successful. Function 19H requires
	the following registers for input:
	
	   AH (upper byte of AX) = 19H
	
	It returns the following:
	
	   AL (lower byte of AX) = current drive code (0=A, 1=B, etc.)
	
	For more information on interrupt 21H, functions 0EH and 19H, see
	Pages 355 and 367 (respectively) of "Advanced MS-DOS Programming,
	Second Edition," by Ray Duncan (Microsoft Press, 1988).
	
	The following program displays all the available logical drives:
	
	'Remember to invoke QB.EXE (or QBX.EXE) with the /L switch) because
	'support for CALL Interrupt is in QB.QLB (or QBX.QLB).
	
	'$INCLUDE: 'qb.bi'                    'Use 'qbx.bi' for QBX.EXE.
	DIM Regs AS RegType                   'Holds register values.
	
	PRINT "The following logical drives are available:";
	
	FOR Drive% = 0 TO 25                  'Circulate through drives A-Z.
	
	   Regs.ax = &HE00                    'Function 0EH (AH = 0EH).
	   Regs.dx = Drive%
	   CALL Interrupt(&H21, Regs, Regs)   'Select a drive, if it's there.
	
	   Regs.ax = &H1900                   'Function 19H (AH = 19H).
	   CALL Interrupt(&H21, Regs, Regs)   'Get currently selected drive.
	
	   IF (Regs.ax AND &HFF) = Drive% THEN  '(Regs.ax AND &HFF) = AL.
	      PRINT " "; CHR$(Drive% + 65);   'If current drive = last drive
	   END IF                             'selected, drive is available.
	
	NEXT Drive%
