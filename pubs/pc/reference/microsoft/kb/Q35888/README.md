---
layout: page
title: "Q35888: CTRL+PRINT SCREEN Fails in EXE Compiled with BCOM Library"
permalink: /pubs/pc/reference/microsoft/kb/Q35888/
---

## Q35888: CTRL+PRINT SCREEN Fails in EXE Compiled with BCOM Library

	Article: Q35888
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 14-DEC-1989
	
	CTRL+PRINT SCREEN works correctly from a program compiled with the
	QuickBASIC BRUN4x.LIB library or run in the QB.EXE editor but fails to
	send output to the printer in a program compiled to a stand-alone
	module with the BC /O option (BCOM4x.LIB). The problem worsens if you
	compile with the Debug option in addition to /O; pressing CTRL+PRINT
	SCREEN then causes subsequent screen output to be truncated, and no
	output goes to the printer.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS (buglist6.00, buglist6.00b). This problem was
	corrected in Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	The problem does not occur in programs compiled in QuickBASIC Version
	3.00. CTRL+PRINT SCREEN works correctly in QuickBASIC Version 3.00.
	Pressing CTRL+PRINT SCREEN in MS-DOS normally acts as a toggle to turn
	on (or off) the redirection of screen output to the printer.
	
	The following is a code example:
	
	10 PRINT "Please press CTRL-PRTSC (or CONTROL+PRINT SCREEN):"
	15 FOR i = 1 TO 5
	20 INPUT "Enter text:"; a$
	25 NEXT
