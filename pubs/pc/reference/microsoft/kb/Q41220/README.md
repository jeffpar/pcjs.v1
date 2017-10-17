---
layout: page
title: "Q41220: Program Hangs the Second Time It Is Run Using an 80287"
permalink: /pubs/pc/reference/microsoft/kb/Q41220/
---

## Q41220: Program Hangs the Second Time It Is Run Using an 80287

	Article: Q41220
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	When compiling a program that uses signal() with an 80287 coprocessor,
	the first time the program runs, everything works correctly. But if
	run a second time, it hangs the computer.
	
	This problem has been confirmed to be with the old 80287 coprocessors
	and has been corrected in newer 80287 chips.
	
	The example program in the "Microsoft C for the MS-DOS Operating
	System: Run-Time Library Reference" manual on Page 280 locks up on the
	second time the program is executed with an old 80287. The following
	is an example:
	
	#include <stdio.h>
	#include <signal.h>
	#include <setjmp.h>
	#include <float.h>
	
	int fphandler ();
	jmp_buf mark;
	double a = 1.0, b = 0.0, c;
	
	main()
	{
	    if(signal(SIGFPE, fphandler) == (int(*) () ) -1)
	     abort();
	
	    if(setjmp(mark) == 0)
	    {
	     c = a/b;
	     printf("Should never get here\n");
	    }
	
	    printf("Recovered from floating-point error\n");
	}
	
	int fphandler (sig, num)
	int sig, num;
	{
	    printf("signal = %d subcode = %d\n", sig, num);
	    _fpreset();
	    longjmp(mark, -1);
	}
