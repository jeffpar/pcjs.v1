---
layout: page
title: "Q34015: GOTO a Labeled ELSE Fails in QB.EXE 4.00 and 4.00b Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q34015/
---

## Q34015: GOTO a Labeled ELSE Fails in QB.EXE 4.00 and 4.00b Editor

	Article: Q34015
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 4-DEC-1988
	
	A QuickBASIC .EXE program compiled with BC.EXE Versions 4.00 or 4.00b
	allows a jump to a labeled ELSE statement in an IF...END IF block.
	However, in the QB.EXE Version 4.00 or 4.00b environment, control
	falls through to the END IF.
	
	To work around this problem, do not use a labeled ELSE.
	
	Microsoft has confirmed this to be a problem in Versions 4.00 and
	4.00b. This problem has been corrected in QuickBASIC Version 4.50.
	
	Note: in QB.EXE and QB87.EXE from QuickBASIC Version 3.00, the
	statements after the ELSE are correctly executed.
	
	The following code example demonstrates the problem:
	
	IF x = 0 THEN
	        PRINT "this is before else"
	        GOTO 100
	100 ELSE
	        PRINT " this is after else"
	END IF
