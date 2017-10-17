---
layout: page
title: "Q44358: SMALLERR.OBJ Makes Smaller .EXE in QuickBASIC 4.50 and BC 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q44358/
---

## Q44358: SMALLERR.OBJ Makes Smaller .EXE in QuickBASIC 4.50 and BC 6.00

	Article: Q44358
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-DEC-1989
	
	SMALLERR.OBJ is an object module shipped with Microsoft QuickBASIC
	Version 4.50 for MS-DOS, Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2, and Microsoft BASIC PDS Version 7.00 for
	MS-DOS and MS OS/2. LINKing with SMALLERR.OBJ causes your executable
	program to report a limited subset of error messages, but reduces the
	size of your executable file by about 2K.
	
	SMALLERR.OBJ can be linked only with BASIC programs compiled as
	stand-alone programs. Standalone programs are created with BC /O,
	using BCOMxx.LIB in QuickBASIC and BASIC compiler 6.00 or 6.00b. In
	BASIC PDS 7.00 you link in BCL70xxx.LIB. With all of the above, you
	must LINK with the /NOE switch, as SMALLERR redefines the error report
	routines in the BCOMxx or BCL70xxx library.
	
	Linking with SMALLERR.OBJ maps all run-time error messages to one of
	the following:
	
	   "Error occurred"
	   "Internal error"
	   "Unprintable error"
	
	Microsoft QuickBASIC Versions 4.00 and 4.00b were not shipped with a
	SMALLERR.OBJ file. QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01,
	and 3.00 were shipped with a SMALLERR.OBJ.
