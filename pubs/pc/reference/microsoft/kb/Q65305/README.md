---
layout: page
title: "Q65305: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 4634"
permalink: /pubs/pc/reference/microsoft/kb/Q65305/
---

## Q65305: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 4634

	Article: Q65305
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	The code below generates the following error if compiled with /Oe and
	/Ol in any memory model:
	
	   fatal error C1001: Internal Compiler Error
	        (compiler file '@(#)regMD.c:1.100', line 4634)
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	extern FILE *ftable;
	extern int nrules;
	extern short *rrhs;
	
	output_rule_data()
	{
	  int i;
	  int j,k;
	
	  for (i=1;i<nrules;i++)
	  {
	    k = i+1;     // Use k for i+1 in the next line as a workaround
	
	    fprintf(ftable,"%6d",rrhs[i+1] - rrhs[i] - 1);
	  }
	}
	
	The following are suggested workarounds:
	
	1. Do the incrementing of the index of the array outside the printf
	   using a temporary variable, and use that variable as the index
	   inside the printf.
	
	2. Compile without the /Oe or /Ol compile option by NOT including the
	   option on the compile line or using the optimize or loopopt pragma.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
