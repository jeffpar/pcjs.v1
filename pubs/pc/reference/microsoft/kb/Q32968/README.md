---
layout: page
title: "Q32968: &quot;Type Mismatch&quot; Using TAB() Between PRINT USING Variables"
permalink: /pubs/pc/reference/microsoft/kb/Q32968/
---

## Q32968: &quot;Type Mismatch&quot; Using TAB() Between PRINT USING Variables

	Article: Q32968
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 22-JAN-1990
	
	When using the TAB function between variables in the following PRINT
	USING and LPRINT USING statements, a "Type Mismatch" error displays in
	the QB.EXE Version 4.00 or 4.00b environment:
	
	   PRINT USING "$$##.##";x;TAB(10);z
	   LPRINT USING "$$##.##";x;TAB(10);z
	
	However, when run as an .EXE program, the above statements print
	successfully. They also run correctly in QuickBASIC Version 3.00,
	either in the editor or as an .EXE program.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in the QuickBASIC editor provided with Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS (buglist6.00,
	buglist6.00b). This problem was corrected in QB.EXE in QuickBASIC
	Version 4.50 and does not occur in the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	(fixlist7.00).
	
	Note: The documentation for PRINT USING and LPRINT USING does not say
	whether TAB is legal in the PRINT USING expressionlist. TAB should be
	avoided in PRINT USING statements because compatibility with future
	Microsoft BASIC versions cannot be guaranteed.
	
	The best workaround for the above problem is to avoid using the TAB
	function in the PRINT USING or LPRINT USING statement, as shown in the
	following examples:
	
	1. To output at a desired column, use spaces between the desired
	   format strings, instead of using the TAB function, as follows:
	
	      x = 12.34 : z = 56.78
	      PRINT USING"$$##.##         $$##.##";x;z
	
	2. To position the cursor at a desired column, use the LOCATE
	   statement before executing the PRINT USING statement, as in the
	   following example:
	
	      x = 12.34: z = 56.78
	      LOCATE 2, 1
	      PRINT USING "$$##.##"; x
	      LOCATE 2, 10
	      PRINT USING "$$##.##"; z
	
	Note: When you type the following statement in QB.EXE Versions 4.00 or
	4.00b, the editor automatically inserts the missing semicolon in front
	of z:
	
	   PRINT USING "$$##.##";x;tab(10) z
	
	The program then usually runs correctly (without getting a "Type
	Mismatch" error) in QB.EXE.
