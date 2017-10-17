---
layout: page
title: "Q44137: CALLing C to Return Single-Precision Gives Incorrect Results"
permalink: /pubs/pc/reference/microsoft/kb/Q44137/
---

## Q44137: CALLing C to Return Single-Precision Gives Incorrect Results

	Article: Q44137
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom S_QuickC S_C
	Last Modified: 8-NOV-1990
	
	From within a BASIC program, invoking a Microsoft C or QuickC function
	that attempts to return a single-precision number may give
	unpredictable results. Returning any other numeric type from a C
	function gives correct results.
	
	To work around the problem, you can pass the single-precision number
	as a parameter (whose value is set inside the C function and passed
	back).
	
	This information applies to Microsoft C Compiler versions 5.00, 5.10,
	and 6.00, and to Microsoft QuickC versions 1.00, 1.01, 2.00, 2.01,
	2.50, and 2.51.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	4.00, 4.00b, and 4.50 for MS-DOS, in Microsoft BASIC Compiler versions
	6.00 and 6.00b (buglist6.00, buglist6.00b) for MS-DOS and OS/2, and in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 (buglist7.00, buglist7.10). We are
	researching this problem and will post new information here as it
	becomes available.
	
	Note that only certain versions of BASIC link with certain versions of
	C, as explained in a separate article found by searching in this
	Knowledge Base for the following words:
	
	   BASIC and C and QuickC and link and compatible and pass and calling
	
	Code Example
	------------
	
	'BASIC code to show incorrect return of a single
	DECLARE FUNCTION doublefun# CDECL ALIAS "_doublefun"
	DECLARE FUNCTION singlefun! CDECL ALIAS "_singlefun"
	DECLARE SUB floatchange CDECL (BYVAL offset%)
	
	x# = doublefun#                   'Works correctly
	y! = singlefun!                   'Returns wrong value
	z! = 0
	CALL floatchange (VARPTR(z!))     'Workaround - pass as parameter
	PRINT x#
	PRINT y!
	PRINT z!
	END
	
	/* C code, compile with /AM (medium memory model)*/
	double doublefun()        /* returns a double */
	{
	  double x;
	  x = 1.45;
	  printf("%f\n",x);
	  return x;
	}
	
	float singlefun()         /* returns a single */
	{
	  float x;
	  x = 1.45;
	  printf("%f\n",x);
	  return x;
	}
	
	void floatchange (x)     /* Takes a single as a parameter */
	float *x;
	{
	  *x = 1.45;
	  printf("%f\n",x);
	}
	
	Program Output
	--------------
	
	  1.450000
	  1.450000              <--These are the C PRINTF statements.
	  1.450000
	
	  1.45
	  2                     <--These are the BASIC PRINT statements.
	  1.45
