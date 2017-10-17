---
layout: page
title: "Q37319: QB.EXE Editor Fails to Flag Extra ELSE Clause as Syntax Error"
permalink: /pubs/pc/reference/microsoft/kb/Q37319/
---

## Q37319: QB.EXE Editor Fails to Flag Extra ELSE Clause as Syntax Error

	Article: Q37319
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50
	Last Modified: 28-DEC-1989
	
	In the program code example below, the QB.EXE environment fails to
	detect an extra ELSE clause in an IF statement as being a syntax
	error. Instead, the number 0 is displayed as well as number 2.
	
	The BC.EXE compiler successfully flags the extra ELSE clause as a
	syntax error. It is logically illegal to use two or more ELSE clauses
	in an IF statement. Only one ELSE clause is allowed in an IF
	statement. (The ELSE clause can also be left out of an IF statement.)
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50. This problem is corrected in the QBX.EXE
	environment that comes with Microsoft BASIC PDS Version 7.00
	(fixlist7.00).
	
	The following is a code example:
	
	a = 0
	IF a = 0 THEN
	  PRINT a
	ELSE
	  PRINT 1
	ELSE
	  PRINT 2
	END IF
