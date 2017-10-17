---
layout: page
title: "Q61674: Machine Hangs When BASIC PDS 7.00 Tries to Call QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61674/
---

## Q61674: Machine Hangs When BASIC PDS 7.00 Tries to Call QuickC 2.00

	Article: Q61674
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900405-131 buglist7.00 S_QuickC
	Last Modified: 11-MAY-1990
	
	When CALLing Microsoft QuickC version 2.00 from Microsoft BASIC
	Professional Development System (PDS) version 7.00, the machine hangs
	if a single- or a double-precision number is passed to the C routine
	and a comparison of that single- or double-precision number is then
	performed in the C routine.
	
	To work around this problem, do one of the following:
	
	1. CALL QuickC from QuickBASIC version 4.50 or from Microsoft BASIC
	   Compiler versions 6.00 or 6.00b.
	
	2. Use Microsoft C Compiler version 5.10 instead of QuickC.
	
	3. Pass an integer or a long integer to QuickC instead of the
	   floating-point number.
	
	The program below demonstrates the problem.
	
	   Compile and LINK Instructions
	   -----------------------------
	
	      BC Basside.bas ;
	      QCL /AM /c Cside.c ;
	      LINK Basside + Cside,,,BRT70ENR.lib + MLIBCE.LIB ;
	
	   Code Example
	   ------------
	
	   ' Here is the BASIC Code
	
	   DECLARE SUB Mycfun CDECL (temp#)
	
	   CLS
	   PRINT "On the basic side"
	   INPUT "Enter the double precision number "; one#
	   CALL Mycfun(one#)
	   LOCATE 10, 10
	   PRINT "Enter any key to end"
	   SLEEP
	   CLS
	   END
	
	   ' Here is the C code
	
	   #include <c:\qc2\include\stdio.h>
	
	   void Mycfun( double *testdoub)
	   {
	     printf("I am in the C routine  %lf \n",*testdoub);
	    if ((*testdoub) > 2000.0)
	     {
	        printf ("In the then \n");
	     }
	     else
	     {
	        printf("In the else \n");
	     };
	
	   printf ("Returning to BASIC \n");
	
	   }
