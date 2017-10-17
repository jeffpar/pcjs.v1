---
layout: page
title: "Q59321: BASIC and C, /FPa, LINK L2025 &quot;Symbol Defined More Than Once&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q59321/
---

## Q59321: BASIC and C, /FPa, LINK L2025 &quot;Symbol Defined More Than Once&quot;

	Article: Q59321
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | SR# S900202-109 S_C buglist6.00 buglist6.00b buglist7.00
	Last Modified: 18-OCT-1990
	
	When linking BASIC and C, where the C routine uses math functions
	(such as SIN, COS) and was compiled with the /FPa (alternate math)
	option and where the BASIC program was compiled with the /FPa option
	and without the /O (stand-alone) option, several "L2025 Symbol defined
	more than once" errors will occur. These errors are not affected by
	/NOD or /NOE LINK options.
	
	Any of the following three workarounds corrects the problem:
	
	1. Compile the BASIC program with BC /o (stand-alone).
	
	2. Compile BASIC and C with (default) BC /FPi.
	
	3. Call all math functions from BASIC. (C can call BASIC externs to do
	   math -- see below.)
	
	Microsoft has confirmed this to be a problem in Microsoft C Compiler
	versions 5.00 and 5.10 (buglist5.00, buglist5.10), in Microsoft BASIC
	Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2, and in
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	The following code example causes the "symbol defined more than once"
	errors when compiled as listed. The following are the compile and link
	lines for the BASIC and C programs:
	
	   BC /FPa testb;
	   CL -c -AL -FPa test.c ;
	   LINK /NOD /NOE testb+test,,,brt70anr llibcar;
	
	When the code below is compiled and LINKed as specified, the following
	LINK errors will occur:
	
	   llibcar.LIB(fcall.ASM) : error L2025: __fpmath : symbol defined
	      more than once
	
	   llibcar.LIB(..\ccalle.ASM) : error L2025: __fpsignal : symbol defined
	      more than once
	
	For more information about calling C from BASIC, search in this
	Knowledge Base using the following word:
	
	   BAS2C
	
	BASIC Program, TESTB.BAS
	------------------------
	
	DECLARE SUB test CDECL
	CALL test
	
	'Function used by C for workaround #3
	FUNCTION BasSin#(a AS DOUBLE)
	   BasSin#=SIN(a)
	END FUNCTION
	
	C Program, TEST.C
	-----------------
	
	#include <stdio.h>
	
	extern double pascal BasSin(double near *);  // BASIC function for
	                                             // workaround #3
	void test()
	{
	double d=1.2;
	printf("%f",sin(d));           // Comment this line and
	//printf("%f",BasSin(&d));     // uncomment this line for workaround #3
	}
