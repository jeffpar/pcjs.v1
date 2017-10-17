---
layout: page
title: "Q30859: &quot;Internal Error&quot; Using FUNCTION as Argument in POKE Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q30859/
---

## Q30859: &quot;Internal Error&quot; Using FUNCTION as Argument in POKE Statement

	Article: Q30859
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 5-DEC-1989
	
	Using a FUNCTION procedure as the second argument in a POKE statement
	will cause an "internal error" when compiling from BC.EXE. The same
	program works correctly when run in the QB.EXE editor environment.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem
	has been corrected in QuickBASIC Version 4.50.
	
	Note: QuickBASIC Version 3.00 and earlier versions do not support
	FUNCTION procedures.
	
	To work around this problem, assign the FUNCTION procedure to a
	temporary variable and then use the temporary variable in the POKE
	statement.
	
	The following is a code example:
	
	DEFINT A-Z
	DECLARE FUNCTION Location(ROW, COL)
	DECLARE FUNCTION ScreenAttrib(F, B)
	
	FUNCTION Location(ROW, COL)
	  Location = 160 * ROW + 2 * COL - 162
	END FUNCTION
	
	FUNCTION ScreenAttrib(F, B)
	  ScreenAttrib = -128 * (F > 15) + (F MOD 16) + (16 * (B MOD 8))
	END FUNCTION
	
	CLS
	DEF SEG=&hb800       'color graphics adapter seg addr
	F = 7                'white foreground
	B = 1                'blue background
	K$="X"               'poke an X onto the screen
	 LOCA = Location(1,1)
	 POKE LOCA, ASC(K$)
	'The next statement causes "Internal error near 1AFB":
	 POKE LOCA+1, ScreenAttrib(F,B)
	
	'Use of a temporary variable eliminates internal error, as follows:
	  SA = ScreenAttrib(F, B)
	  POKE LOCA+1, SA
	END
