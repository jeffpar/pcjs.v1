---
layout: page
title: "Q60135: L2025 Creating Quick Library Using Functions in SIGNAL.H"
permalink: /pubs/pc/reference/microsoft/kb/Q60135/
---

## Q60135: L2025 Creating Quick Library Using Functions in SIGNAL.H

	Article: Q60135
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900114-12
	Last Modified: 3-APR-1990
	
	When placing a C program using the functions from SIGNAL.H into a
	Quick library for QuickBASIC (QB.EXE) or QuickBASIC Extended
	(QBX.EXE), LINK flags multiple occurrences of L2025 "Symbol defined
	more than once" in the CRT0DAT.ASM module of the C library. These
	errors are not affected by the /NOE (No Extended library search)
	option. This conflict is a limitation of Quick libraries. The SIGNAL.H
	functions work correctly when linked with a compiled BASIC program.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, QB.EXE from Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS, QBX.EXE from Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS, Microsoft QuickC Versions 1.00,
	1.01, 2.00, and 2.01, and Microsoft C Compiler Versions 5.00 and 5.10
	for MS-DOS.
	
	When the C code from the example below is compiled and linked into a
	Quick library as shown, the error L2025 is cited multiple times:
	
	   QCL -c -AL signal.c ;     (QuickC)
	   CL -c -AL signal.c ;      (C Compiler)
	
	   LINK /Q signal,,,qbxqlb;      (LINK -> QLB in BC7)
	   LINK /Q signal,,,bqlb45;      (LINK -> QLB in QB45)
	
	Code Example
	------------
	
	The following code example demonstrates calling the raise() function
	from the SIGNAL.H file in C. When compiled and linked to a QLB as
	listed above, multiple L2025 errors occur:
	
	   #include <signal.h>
	   void test()
	      {
	      printf("SigFPE: %d\n",raise(SIGFPE));   /* Signal float error */
	      }
	
	The following BASIC source demonstrates how to call the above C
	routine:
	
	   DECLARE SUB test CDECL ()
	   CALL test
	
	The above BASIC program compiles and links correctly to an EXE despite
	the fact that it fails to create a usable QLB file. The BASIC compile
	and link lines are as follows:
	
	   BC testsig;
	   LINK /NOE testsig+signal;
	
	The working EXE produces the following output:
	
	   SigFPE: -1
