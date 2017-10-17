---
layout: page
title: "Q38878: Calling a BIOS Interrupt to Determine the Scan Code of a Key"
permalink: /pubs/pc/reference/microsoft/kb/Q38878/
---

## Q38878: Calling a BIOS Interrupt to Determine the Scan Code of a Key

	Article: Q38878
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-FEB-1990
	
	This article gives an example of a CALL INTERRUPT to determine the
	scan code of a key. This program only reports the scan codes for keys
	that are supported in the BIOS of the machine. Keys such as F11 and
	F12 do not return scan codes using this interrupt. There are other
	interrupts that can be used to get the scan codes of extended keys,
	but they are only supported on machines with extended BIOS. This
	example program is generic and runs on any PC compatible.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	The interrupt called is "READ STATUS." This is BIOS interrupt 16 Hex,
	Function 1 Hex.
	
	The following is a code example:
	
	'The following example requires the Quick library, QB.QLB and the
	'include file, QB.BI. When starting the QuickBASIC environment,
	'one must type: QB /L QB.QLB.
	
	' $INCLUDE: 'QB.BI'
	' Note: You will have to include 'qbx.bi' for BASIC PDS 7.0
	DIM inregs AS regtype
	DIM outregs AS regtype
	inregs.ax = &H1         ' Function 1
	DO
	  CALL INTERRUPT(&H16, inregs, outregs)     ' Call INT 16H
	  PRINT "Scan Code is "; outregs.ax \ 256,  ' AH
	  PRINT "ASCII is "; outregs.ax AND 255     ' AL
	LOOP
	END
