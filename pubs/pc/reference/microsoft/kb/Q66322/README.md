---
layout: page
title: "Q66322: D2030 Compiler Error in "P3" or Machine Hangs During Compile"
permalink: /pubs/pc/reference/microsoft/kb/Q66322/
---

	Article: Q66322
	Product: Microsoft C
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a
	Last Modified: 24-OCT-1990
	
	When the code below is compiled under OS/2 using the Microsoft C
	version 6.00a compiler and using the following command-line switches
	
	   cl /Gi /Od test.c
	
	the result is as follows:
	
	   Command line error D2030 : INTERNAL COMPILER ERROR IN 'P3'
	                 Contact Microsoft Product Support Services
	
	Under DOS, the system will hang during pass three of the compiler.
	
	Code Example
	------------
	
	#include <stdio.h>
	void foo(void)
	{
	     char Key;
	     switch( Key = getch() ) {
	           case '1' : break;
	           case '2' :
	           default: break;
	     }
	}
	void main(void)
	{
	     foo();
	}
	
	This error indicates that the third pass of the compiler ("P3") is
	encountering a general protection fault. This error does not occur
	under C version 6.00.
	
	Workaround
	----------
	
	The following are three possible workarounds:
	
	1. Compile without the /Gi option.
	
	2. Compile with the /qc option.
	
	3. Compile with the medium or large memory model.
	
	Microsoft has confirmed this to be a problem with the C compiler
	version 6.00a. We are researching this problem and will post new
	information here as it becomes available.
