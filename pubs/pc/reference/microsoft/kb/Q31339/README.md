---
layout: page
title: "Q31339: How to Extract .OBJ Routines from .LIB Files Using LIB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q31339/
---

## Q31339: How to Extract .OBJ Routines from .LIB Files Using LIB.EXE

	Article: Q31339
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 27-DEC-1989
	
	The following steps will guide you when trying to extract .OBJ
	routines from QB.LIB, using the library manager LIB.EXE. QB.LIB is
	provided on the QuickBASIC release disk.
	
	The following information applies to QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	1. Get a cross-reference listing file of QB.LIB to identify the name
	   of the routine to be extracted. You can do this by using the
	   library manager LIB.EXE as follows:
	
	   LIB QB.LIB,listfile;
	
	   If "CON" is used as the name of the list file, then the listing
	   file will appear on the screen. The listing for QB.LIB looks like
	   the following:
	
	   ABSOLUTE..........absolute          INT86OLD..........int86old
	   INT86XOLD.........int86old          INTERRUPT.........intrpt
	   INTERRUPTX........intrpt
	
	   absolute          Offset: 00000010H  Code and data size: cH
	     ABSOLUTE
	
	   intrpt            Offset: 000000e0H  Code and data size: 107H
	     INTERRUPT         INTERRUPTX
	
	   int86old          Offset: 000002a0H  Code and data size: 11eH
	     INT86OLD          INT86XOLD
	     ABSOLUTE
	
	   intrpt            Offset: 000000e0H  Code and data size: 107H
	     INTERRUPT         INTERRUPTX
	
	   int86old          Offset: 000002a0H  Code and data size: 11eH
	     INT86OLD          INT86XOLD
	
	2. To extract one of the .OBJ routines, use the library manager
	   command "*module-name", where module-name is the name of the .OBJ
	   routine inside the library. The following is an example:
	
	   LIB QB.LIB *intrpt;
	
	   Once executed, a copy of intrpt will be placed in the working
	   directory with the same name and .OBJ extension. Remember, the
	   routines are listed in lowercase.
	
	For additional Library Manager command symbols refer to Page 231 of
	the "Microsoft QuickBASIC: Learning to Use" manual.
	
	The Library Manager (LIB.EXE) is provided with the QuickBASIC Compiler
	Versions 4.00 and later; however, it is not provided with QuickBASIC
	Versions 3.00 and earlier versions. LIB.EXE is also provided with the
	Microsoft Macro Assembler.
