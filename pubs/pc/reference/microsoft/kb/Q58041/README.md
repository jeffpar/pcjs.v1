---
layout: page
title: "Q58041: INTERRUPTs Using Strings Need SSEG for Segment in QBX &amp; BC /Fs"
permalink: /pubs/pc/reference/microsoft/kb/Q58041/
---

## Q58041: INTERRUPTs Using Strings Need SSEG for Segment in QBX &amp; BC /Fs

	Article: Q58041
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_C H_MASM SR# S900112-133
	Last Modified: 2-FEB-1990
	
	Because the QuickBASIC Extended (QBX.EXE) editor that comes with
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	uses far addresses for all strings, some CALL INTERRUPT statements
	that worked in earlier versions of Microsoft's BASIC products require
	modification for correct results.
	
	To correct for this behavior, change the segment passed to the
	INTERRUPT to be SSEG(stringvariable).
	
	This information applies to Microsoft QuickBASIC Extended (QBX.EXE)
	and to programs compiled with BC /Fs in Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	In earlier versions of Microsoft BASIC's, near strings were used.
	Because of this, the VARSEG of the string variable, or -1 in some
	cases, could be used for the segment. In BASIC PDS 7.00, you must use
	the SSEG function to return the segment of a string variable.
	
	The following table shows the difference in the method of assigning
	the registers for string variables:
	
	   BASIC Versions 6.00/6.00b    BASIC PDS Version 7.00
	   -------------------------    ----------------------
	
	   inregs.DS = VARSEG(a$)       inregs.DS = SSEG(a$)   '**** SSEG
	   inregs.DX = SADD(a$)         inregs.DX = SADD(a$)
	   inregs.ES = -1               inregs.ES = SSEG(b$)   '**** SSEG
	
	In addition to INTERRUPTs, the change to far strings could also have
	the same effect on mixed-language programming with Microsoft C and
	Microsoft Macro Assembler (MASM).
