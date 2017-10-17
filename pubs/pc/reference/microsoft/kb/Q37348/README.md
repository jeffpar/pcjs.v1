---
layout: page
title: "Q37348: New COMMAND&#36; Will Not Pass with RUN from within QB Program"
permalink: /pubs/pc/reference/microsoft/kb/Q37348/
---

## Q37348: New COMMAND&#36; Will Not Pass with RUN from within QB Program

	Article: Q37348
	Version(s): 3.00 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	A QuickBASIC program will return the COMMAND$ as expected, but the RUN
	statement with an appended command string will not pass the COMMAND$
	to the new program. Instead, the original COMMAND$ from the first
	program is passed to the second (RUN) program. The two programs below
	demonstrate this behavior.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	If you type "PROG1 /Z" on the MS-DOS command line, "/Z" is returned
	with the COMMAND$ function in both programs, regardless of what is
	entered for X$ in Prog1. Because the RUN statement is used with a
	quoted string, the " + X$" is concatenated to the program name string.
	This means that if X$ equals "/B", then the RUN statement is actually
	RUN "PROG2.EXE/B", which is not a valid filename.
	
	The following is a code example:
	
	REM   *** Prog1 ***
	PRINT "Here is the COMMAND$: "; COMMAND$
	INPUT "Enter the new COMMAND$"; X$
	RUN "PROG2.EXE" + X$                       'Either .BAS or .EXE
	END
	
	REM   *** Prog2 ***
	PRINT "Here is the COMMAND$: "; COMMAND$
	END
