---
layout: page
title: "Q60708: Hardware Failure Possible Cause of C1001"
permalink: /pubs/pc/reference/microsoft/kb/Q60708/
---

	Article: Q60708
	Product: Microsoft C
	Version(s): 5.10 6.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 19-APR-1990
	
	In some cases, it is possible for hardware failures to generate an
	internal compiler error (C1001). Specifically, either a hard drive or
	drive controller may be the problem.
	
	The following are some of the signs of a hardware failure causing an
	internal compiler error:
	
	1. A simple program giving a C1001 at compile time, for example:
	
	      #include <stdio.h>
	
	      void main (void)
	      {
	          printf ("This is a test...\n") ;
	      }
	
	2. Receiving a C1001 on a line of code that is a simple statement,
	   with no optimization on. For example:
	
	      foo = 3 ;   /*  This should NOT cause C1001 */
	
	3. A program compiling one time, then failing with a C1001 error on
	   all subsequent compilations.
	
	4. A program consistently giving a C1001 error on one specific
	   computer, while compiling correctly on another computer.
	
	5. The problem goes away when a RAM disk is used for the storage of
	   temporary files, as pointed to by the TMP environment variable. This
	   would not be the case if you had some bad RAM.
	
	If any of the above is happening to you and you suspect hardware
	problems, take the code to another machine and try it there. If the
	problem does not appear on the second machine, the hardware of the
	original machine may be faulty and need repair.
