---
layout: page
title: "Q32270: COMMON Variable Has Different Value with .EXE Versus QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q32270/
---

## Q32270: COMMON Variable Has Different Value with .EXE Versus QB.EXE

	Article: Q32270
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 13-DEC-1989
	
	If a variable in COMMON and a variable in the body of a program have
	the same name but a different type specifier (%, !, #, or &), the
	QuickBASIC environment may make incorrect assumptions about the type,
	compared to the resulting .EXE file. An example is shown below, where
	the value of a variable is different when run in QB.EXE versus the
	compiled .EXE program.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and the QuickBASIC Compiler provided with BASIC
	compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). The problem does not occur with programs compiled with
	BC.EXE. This problem was corrected in QuickBASIC Version 4.50 and in
	the QBX.EXE environment of Microsoft BASIC PDS Version 7.00
	(fixlist7.00).
	
	The following program produces different results with BC.EXE versus
	QB.EXE:
	
	   COMMON SHARED A
	   A%=5
	   CALL TEST
	   END
	
	   SUB TEST STATIC
	     PRINT A
	   END SUB
	
	When compiled with BC.EXE, the program correctly displays 0. When run
	in QB.EXE, the program incorrectly displays 5.
	
	This problem occurs because QB.EXE works on the premise that you
	really wanted the variable A in COMMON to be an integer instead of
	single precision.
