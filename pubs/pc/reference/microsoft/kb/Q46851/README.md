---
layout: page
title: "Q46851: Calling C Function That Uses getenv() Doesn't Work"
permalink: /pubs/pc/reference/microsoft/kb/Q46851/
---

## Q46851: Calling C Function That Uses getenv() Doesn't Work

	Article: Q46851
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890601-20 B_BasicCom S_C S_QuickC
	Last Modified: 28-DEC-1989
	
	When a compiled BASIC program CALLs a C function that uses the
	getenv() function, no path is returned from getenv(). The getenv()
	function in C uses the ENVIRON variable to access the environment
	table. The ENVIRON variable is an array of pointers to the strings
	that constitute the process environment. This variable is initialized
	by the C start-up code. Since the C function is CALLed from the BASIC
	program, the C start-up code is not executed; therefore, the ENVIRON
	variable is not initialized (it is NUL by default).
	
	To work around this problem, use the ENVIRON$ function in the BASIC
	program and pass the desired path to the C function.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler Versions 6.00 and 6.00b; to
	Microsoft BASIC PDS Version 7.00; to Microsoft QuickC Compiler
	Versions 1.00, 1.01, 2.00, 2.01; and to Microsoft C Compiler Versions
	5.00 and 5.10.
	
	Code Example
	------------
	
	The following are the BASIC and C source files that demonstrate that
	CALLing a C function that uses the getenv() function returns a NUL
	ENVIRON variable:
	
	' BASIC Source Code:
	DECLARE SUB EnvironTest CDECL ()
	CLS
	CALL EnvironTest
	END
	
	/* C source code: */
	#include <stdlib.h>
	#include <stdio.h>
	void EnvironTest(void)
	{
	  char *temp;
	  temp = getenv( "PATH" );
	  printf( "Path: %s\nenviron: %x\n", temp, environ );
	}
