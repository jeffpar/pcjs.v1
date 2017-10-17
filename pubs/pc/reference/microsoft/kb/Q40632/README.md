---
layout: page
title: "Q40632: If PRINT Fails on Non-Standard System, PRINT#n to &quot;CONS:&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q40632/
---

## Q40632: If PRINT Fails on Non-Standard System, PRINT#n to &quot;CONS:&quot;

	Article: Q40632
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890112-74
	Last Modified: 12-DEC-1989
	
	The PRINT and WRITE statements write directly to video memory; they do
	not write to the screen through function calls to MS-DOS or the ROM
	BIOS. This information applies to Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	By circumventing MS-DOS and the ROM BIOS, the PRINT and WRITE
	statements may not work correctly with certain non-standard or
	unsupported operating-system configurations (such as PC-MOS,
	Multi-DOS, or multitasking packages added to MS-DOS).
	
	To be more compatible with non-standard systems, you can send output
	to a logical device name that routes the characters through an
	MS-DOS character device driver.
	
	For example, output through the "CONS:" (CONSole) or "CON" device name
	forces all output through the MS-DOS console device driver. The MS-DOS
	console device driver makes ROM BIOS calls to perform the output.
	
	You can OPEN "CONS:" FOR OUTPUT AS #n and send output with the PRINT#n
	or WRITE#n statement.
	
	Similarly, if you have trouble printing with LPRINT to a network
	printer, OPEN "LPT1:" FOR OUTPUT AS #n and send output with the
	PRINT#n or WRITE#n statement.
	
	Some computer manufacturers provide an ANSI.SYS device driver on their
	DOS disk. Limited graphics control may be performed through ANSI
	control codes. For more information about ANSI codes, query on the
	following words:
	
	   PRINT# MS-DOS "CON" Device ANSI Escape Codes
	
	The following device names supported by the OPEN statement are
	discussed on Pages 293 and 294 of the "Microsoft QuickBASIC Version
	4.0: BASIC Language Reference" manual for Versions 4.00 and 4.00b:
	
	   "CONS:"
	   "KYBD:"
	   "SCRN:"
	   "COM1:", "COM2:"
	   "LPT1:", "LPT2:"
	
	The following is a code example:
	
	CLS
	OPEN "CONS:" FOR OUTPUT AS #1
	PRINT #1, "Howdy pahd-nuh..."
	CLOSE #1
	END
