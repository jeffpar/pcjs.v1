---
layout: page
title: "Q27496: &quot;Overflow&quot; Error Using QLBDUMP.BAS with Large Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q27496/
---

## Q27496: &quot;Overflow&quot; Error Using QLBDUMP.BAS with Large Quick Library

	Article: Q27496
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 25-APR-1990
	
	When running the program QLBDUMP.BAS, large Quick libraries can cause
	an "Overflow" error. The error occurs in the following line:
	
	   QHdrPos = (EHdr.CParHdr + EHdr.CS) * 16 + EHdr.IP + 1
	
	This error can be corrected by making the 16 into a long-integer
	constant. To do this, change the line to read as follows:
	
	   QHdrPos = (EHdr.CParHdr + EHdr.CS) * 16& + EHdr.IP + 1
	
	Alternatively, you can invoke the CLNG function as follows:
	
	   QHdrPos = CLNG(EHdr.CParHdr + EHdr.CS) * 16 + EHdr.IP + 1
	
	Microsoft has confirmed this to be a problem in the QLBDUMP.BAS
	program example provided in QuickBASIC Versions 4.00, 4.00b, and 4.50,
	and in Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	MS OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 (fixlist7.00).
	
	The problem occurs because the calculations on the right-hand side of
	the equation are being done in normal-integer math, even though the
	result is to be stored in a long-integer variable. Making the 16 a
	long integer forces the right-hand side of the equation to do its math
	in long-integer format.
	
	The QLBDUMP program lets you display the routines that are stored in a
	.QLB Quick library. The QB.EXE editor uses Quick libraries for calling
	external routines. Quick libraries (.QLB files) have no other purpose.
