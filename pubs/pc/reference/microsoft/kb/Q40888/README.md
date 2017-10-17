---
layout: page
title: "Q40888: RUN and execlp Between QB 4.00 and C Can Dump to DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q40888/
---

## Q40888: RUN and execlp Between QB 4.00 and C Can Dump to DOS

	Article: Q40888
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890124-94 buglist4.00 fixlist4.00b fixlist4.50
	Last Modified: 17-FEB-1989
	
	When transferring control back and forth between a Microsoft
	QuickBASIC Version 4.00 compiled program (using the RUN statement) and
	a Microsoft C program (using the execlp routine), the C program can
	dump itself to MS-DOS. The following are the conditions necessary for
	this behavior to occur:
	
	1. The QuickBASIC program RUNs a C program with the RUN statement.
	
	2. The Microsoft C program invokes the execlp routine to transfer
	   control back to the QuickBASIC program.
	
	3. The QuickBASIC program RUNs the C program again. At this point,
	   the Microsoft C program aborts to MS-DOS.
	
	The error only occurs when QuickBASIC is the starting program. If C
	started the process, the transfer of control continues correctly back
	and forth without aborting.
	
	Microsoft has confirmed this to be a problem in Version 4.00. This
	problem was corrected in Version 4.00b (and 4.50).
	
	Below is the QuickBASIC example code, BEXAMPLE.BAS:
	
	' Compile and LINK as follows:  BC /O BEXAMPLE;
	'                               LINK BEXAMPLE;
	CLS
	PRINT "Inside the BASIC Program."
	FOR i = 1 TO 1000: NEXT i          ' Do nothing loop to take up time
	PRINT "Calling C."
	FOR i = 1 TO 1000: NEXT i          ' Do nothing loop to take up time
	RUN "CEXAMPLE"                     ' Calls the C Program
	END
	
	Below is the C example code, CEXAMPLE.C:
	
	/*
	   Compile and LINK as follows:  CL /lib/graphics CEXAMPLE.C
	*/
	#include <stdio.h>
	#include <graph.h>
	#include <process.h>
	main()
	{
	_clearscreen(_GCLEARSCREEN);
	printf("In The C Program.....Hit RETURN To Continue");
	getchar();
	_clearscreen(_GCLEARSCREEN);
	execlp("BEXAMPLE.EXE",NULL);             /* Calls the QB Program */
	}
