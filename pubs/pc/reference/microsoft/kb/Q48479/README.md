---
layout: page
title: "Q48479: Correction for BASIC Calling POWER2, &quot;Mixed-Language&quot;: Page 81"
permalink: /pubs/pc/reference/microsoft/kb/Q48479/
---

## Q48479: Correction for BASIC Calling POWER2, &quot;Mixed-Language&quot;: Page 81

	Article: Q48479
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom S_C H_MASM S_PasCal
	Last Modified: 7-FEB-1990
	
	The following correction applies to Page 81 of the "Microsoft
	Mixed-Language Programming Guide," which is provided with C Versions
	5.00 and 5.10, Macro Assembler Versions 5.00 and 5.10, and Pascal
	Version 4.00 (but is NOT provided with QuickBASIC Version 4.00, 4.00b,
	or 4.50, Microsoft BASIC Compiler Version 6.00 or 6.00b, or Microsoft
	BASIC Professional Development System (PDS) Version 7.00).
	
	On Page 81 of the "Microsoft Mixed-Language Programming Guide," the
	BASIC program example is incomplete. The structure of the code as
	shown incorrectly returns a value of 0 (zero) for the POWER2 assembler
	function. This error occurs because POWER2(3,5) is interpreted by
	BASIC to be an array as opposed to a FUNCTION as it was intended to
	be.
	
	To correct the program, add the following line after the DEFINT A-Z
	statement:
	
	   DECLARE FUNCTION Power2 (x, y)
	
	The program in its entirety should read:
	
	   DEFINT A-Z
	   DECLARE FUNCTION Power2 (x, y)
	   PRINT "3 times 2 to the power of 5 is ";
	   PRINT Power2(3,5)
	   END
	
	This BASIC program can be compiled with Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50 for MS-DOS, Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2, or Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	The assembly language routine on Page 82 is correct and returns the
	expected values when you add the above DECLARE in the BASIC code.
