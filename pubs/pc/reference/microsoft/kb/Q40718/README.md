---
layout: page
title: "Q40718: BASIC TYPE...END TYPE Must Be Physically at Top of Program"
permalink: /pubs/pc/reference/microsoft/kb/Q40718/
---

## Q40718: BASIC TYPE...END TYPE Must Be Physically at Top of Program

	Article: Q40718
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890117-64 B_BasicCom
	Last Modified: 15-DEC-1989
	
	The QuickBASIC TYPE...END TYPE statement must be physically at the top
	of the program. If it isn't, the program may not compile correctly.
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The code example shown below does not compile correctly. In the QB.EXE
	editor, an error "Identifier cannot include a period" is reported on
	Line 2. In BC.EXE, two errors are reported, as follows:
	
	   Variable name not unique
	
	   Type Mismatch
	
	To correct the program, move the TYPE ... END TYPE block and the DIM
	statement before the use of the variable. It is best to place these
	types of statements at the beginning of the program.
	
	The following is sample code:
	
	GOSUB initvar
	  PRINT x.str
	END
	
	initvar:
	        TYPE user
	            str AS STRING * 10
	        END TYPE
	        DIM x AS user
	        x.str = "hello"
	RETURN
