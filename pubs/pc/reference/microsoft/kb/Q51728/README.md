---
layout: page
title: "Q51728: Manual Correction for MASM Returning Single or Double to BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q51728/
---

## Q51728: Manual Correction for MASM Returning Single or Double to BASIC

	Article: Q51728
	Version(s): 5.00   | 5.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr B_BasicCom H_MASM B_QuickBas
	Last Modified: 15-MAR-1990
	
	The following information is relevant to BASIC programmers who want
	their BASIC programs to correctly invoke assembly language functions
	that return single- or double-precision floating-point values.
	
	The following two corrections apply to Page 78 of the "Microsoft
	Mixed-Language Programming Guide," which comes with Microsoft C
	Compiler Version 5.00 and with Microsoft Macro Assembler (MASM)
	Version 5.00 (but does not come with BASIC):
	
	1. In Section 6.1.6, in the second paragraph, the phrase "BASIC or"
	   should be deleted.
	
	2. In the third paragraph, change the phrase "FORTRAN or Pascal"
	   to "BASIC, FORTRAN, or Pascal".
	
	This documentation error was corrected in the "Microsoft
	Mixed-Language Programming Guide" supplied with Versions 5.10 of
	Microsoft C and Microsoft Macro Assembler.
	
	The first sentence in the second paragraph in Section 6.1.6 on Page 78
	should thus read as follows:
	
	   When the return value is larger than 4 bytes, a procedure called
	   by C must allocate space for the return value and then place its
	   address in DX:AX.
	
	The first sentence in the third paragraph in Section 6.1.6 on Page 78
	should thus read as follows:
	
	   If your assembly procedure is called by BASIC, FORTRAN, or Pascal,
	   then it must use a special convention in order to return
	   floating-point values, records and arrays, and values larger than
	   4 bytes.
	
	For a complete guide for passing parameters and invoking functions
	between BASIC and assembly language, search in the Microsoft Knowledge
	Base for the following word: BAS2MASM.
