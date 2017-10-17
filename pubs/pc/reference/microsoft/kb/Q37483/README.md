---
layout: page
title: "Q37483: CHAIN &quot;RETURN Without GOSUB&quot; When Using ON ERROR GOTO &amp; No /O"
permalink: /pubs/pc/reference/microsoft/kb/Q37483/
---

## Q37483: CHAIN &quot;RETURN Without GOSUB&quot; When Using ON ERROR GOTO &amp; No /O

	Article: Q37483
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	When chaining from a program that does not trap errors (ON ERROR GOTO)
	to a program that does, a "RETURN without GOSUB" error message can
	appear. This occurs only when the programs are compiled requiring the
	run-time library BRUN4x.EXE.
	
	Because the run-time system is initialized in the first program, you
	need to compile both programs with BC /E to support error trapping.
	
	Another way to avoid this problem is to compile both programs with BC
	/O to make them stand alone. With this process, the chaining program
	does not require compiling with /E.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2. The code below does not generate the error
	described above with Microsoft BASIC PDS Version 7.00.
	
	The programs below, when compiled without /O, will give the "RETURN
	without GOSUB" run-time error message in the second program.
	
	Code Examples
	-------------
	
	The first program is as follows:
	
	' TEST.BAS
	      CHAIN "test1"
	      END
	
	The second program is as follows:
	
	' TEST1.BAS
	      ON ERROR GOTO 0
	      K% = 1
	      ON K% GOSUB handle
	      END
	handle:
	      A$ = INKEY$: IF A$ = "" THEN GOTO handler
	      RETURN
