---
layout: page
title: "Q42470: If BC /O, CHAIN &quot;x.BAS&quot; Fails to Give Run-Time Error and Hangs"
permalink: /pubs/pc/reference/microsoft/kb/Q42470/
---

## Q42470: If BC /O, CHAIN &quot;x.BAS&quot; Fails to Give Run-Time Error and Hangs

	Article: Q42470
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890217-22 buglist4.50
	Last Modified: 26-FEB-1990
	
	If two programs are compiled with the BC /O (stand-alone option), and
	the first program CHAINs to the second program with the following
	CHAIN statement, then the program fails to give an error message for
	the ".BAS" extension:
	
	   CHAIN "prog2.BAS"
	
	The CHAIN is not executed, and program execution either ends or hangs
	the machine.
	
	The correct response should be the following run-time error:
	
	  Illegal Function Call in Module "module name" at address XXXX:XXXX
	
	This information applies only to programs compiled with the
	stand-alone (/O) switch in QuickBASIC Version 4.50. The debug (/D)
	switch does not change the problem. If compiled requiring BRUN45, the
	problem does not occur. The problem also doesn't occur with QuickBASIC
	Version 4.00 or 4.00b or Microsoft BASIC Compiler Version 6.00 or
	6.00b.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Version
	4.50. This problem was corrected in Microsoft BASIC Professional
	Development System (PDS) Version 7.00, (fixlist7.00).
	
	In Microsoft BASIC PDS 7.00, the run-time error message generated is
	as follows:
	
	  Bad file mode in module MODULE NAME at address XXXX:XXXX
	
	To work around the problem, do not include an extension on the program
	name in the CHAIN statement. QB.EXE and BC.EXE are able to determine
	which program to CHAIN to if there are two files with the same name
	but different extensions:
	
	  CHAIN "PROG2" will CHAIN to PROG2.BAS in QB.EXE
	  CHAIN "PROG2" will CHAIN to PROG2.EXE in BC.EXE
	
	Code Example
	------------
	
	Compiling the following two programs with BC /O demonstrates the
	problem:
	
	   '*** PROGRAM #1 (PROG1.EXE)
	   '************
	   PRINT "CHAINing to PROGRAM #2"
	   CHAIN "prog2.bas"
	   END
	
	   '*** PROGRAM #2 (PROG2.EXE)
	   '**************
	   PRINT "INSIDE PROGRAM #2"
	   END
