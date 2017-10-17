---
layout: page
title: "Q37769: Using Run-Time Module, RUN Makes Program Lose 70K Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q37769/
---

## Q37769: Using Run-Time Module, RUN Makes Program Lose 70K Memory

	Article: Q37769
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10 B_QuickBas
	Last Modified: 20-SEP-1990
	
	When a program compiled without the /O option executes the RUN
	statement to run a second program, the run-time module (BRUNxx.EXE or
	BRTMxx.EXE) is unloaded from memory. However, the 70K of space for the
	run-time module fragments memory, and approximately 70K of RAM is
	unavailable to the program run with the RUN statement. When the second
	program quits or transfers control, the 70K of memory is available
	again.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Compiler versions 6.00 and 6.00b for MS-DOS, Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS, and Microsoft QuickBASIC Compiler versions 4.00, 4.00b, and
	4.50 (buglist4.00, buglist4.00b, buglist4.50) for MS-DOS. We are
	researching this problem and will post new information here as it
	becomes available. This problem doesn't occur in QuickBASIC version
	3.00.
	
	This temporary fragmentation of memory can contribute towards causing
	any one of the following errors when attempting to RUN another .EXE
	program: "Out of Memory," "Error R6005," or the MS-DOS message "Not
	enough memory to Exec."
	
	To work around this problem, you can make the program that uses the
	run-time module RUN another BASIC program compiled with the BC /O
	(stand-alone) option, which in turn can RUN the desired .EXE program.
	
	If the first BASIC program is compiled with the BC /O (stand-alone)
	option, all but 200 bytes are available after the RUN statement. In
	this case, the 200 missing bytes are the expected overhead associated
	with the RUN statement.
	
	The following are two different examples (1 and 2) that duplicate the
	problem:
	
	1. To duplicate the problem, do the following:
	
	   a. Compile the following program WITHOUT the BC /O (stand-alone)
	      option:
	
	         ' TEST1.BAS
	         PRINT FRE(-1)
	         RUN "TEST2"
	
	   b. Compile the following program WITH the BC /O (stand-alone)
	      option:
	
	         ' TEST2.BAS
	         PRINT FRE(-1)
	
	   c. Run TEST1.EXE. The following is sample output:
	
	         439432  (from TEST1)
	         429432  (from TEST2)
	
	   d. Run TEST2.EXE alone. The following is sample output:
	
	         500232  (from TEST2)
	
	      There is about 70K more far heap available for TEST2 when it is
	      run alone compared to when it is run from a BASIC program using
	      the BRUNxx.EXE module.
	
	2. The problem was originally reported using the RUN statement to
	   execute a Microsoft C .EXE program.
	
	   To duplicate this problem, compile (without /O) and run the BASIC
	   program below, which RUNs a Microsoft C program. The C routine
	   prints the approximate amount of memory free. When the BASIC
	   routine is compiled with the run-time module, about 70K is lost.
	
	   If you RUN the C program from the BASIC routine compiled with /O
	   and then compare with running the C program from MS-DOS, the memory
	   numbers are within 200 bytes of one another.
	
	   The following BASIC routine RUNS the C routine:
	
	      RUN "memtest.exe"
	
	   The following Microsoft C routine prints available memory:
	
	/*   memtest.c   */
	#include <dos.h>
	#include <malloc.h>
	#include <stdio.h>
	long l;
	unsigned int j,pp;
	main()
	{
	union REGS inregs, outregs;
	inregs.h.ah=0x48;
	inregs.x.bx=0xffff;
	intdos(&inregs,&outregs);
	l=(long)(outregs.x.bx * 16L); /*amount available from far heap*/
	j=_memavl();/*calculate approximate amount available from near heap*/
	printf("approximate # of bytes available for allocation %ld\n",l+j);
	}
