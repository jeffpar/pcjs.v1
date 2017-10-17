---
layout: page
title: "Q39581: Can't Define SUB/FUNCTION in INCLUDE File"
permalink: /pubs/pc/reference/microsoft/kb/Q39581/
---

## Q39581: Can't Define SUB/FUNCTION in INCLUDE File

	Article: Q39581
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas SR# S881209-27
	Last Modified: 1-FEB-1990
	
	The command line compiler BC.EXE fails to flag the error if you put a
	procedure definition (SUB...END SUB or FUNCTION...END FUNCTION) into
	an INCLUDE file. The program compiles, LINKs, and runs without error.
	
	QB.EXE, and QBX.EXE included with Microsoft BASIC Professional
	Development System (PDS) Version 7.00, correctly gives the error
	"Statement cannot occur within include file." Procedure definitions
	are not allowed in $INCLUDE files.
	
	This information applies to QuickBASIC Versions 4.00b and 4.50, to
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, and Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The BC.EXE from QuickBASIC Version 4.00 correctly flags the error.
	
	The following is a example:
	
	   DIM arr(50)
	   REM $INCLUDE: 'getsub.inc'
	   FOR i = 1 TO 50
	      arr(i) = i
	   NEXT i
	   CALL prntarray(arr())
	   END
	
	   'This is GETSUB.INC, the separate include file:
	   SUB prntarray (a())
	      FOR j = 1 TO 50
	         PRINT a(j)
	      NEXT j
	   END SUB
