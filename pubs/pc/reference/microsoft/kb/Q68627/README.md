---
layout: page
title: "Q68627: C1001: Internal Compiler Error: omfMD.c, Line 446"
permalink: /pubs/pc/reference/microsoft/kb/Q68627/
---

	Article: Q68627
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 6-FEB-1991
	
	The sample program below attempts to save data in the code segment
	using inline assembly, but produces the following internal compiler
	error when compiled with or without optimizations:
	
	   foo.c(10) : fatal error C1001: Internal Compiler Error
	                (compiler file '@(#)omfMD.c:1.26', line 446)
	                Contact Microsoft Product Support Services
	
	The sample code was designed to store the stack segment immediately
	after the jmp instruction. The code should compile without any errors;
	however, it is usually not good programming choice to write
	self-modifying code.
	
	The following are two workarounds:
	
	1. Compile with /qc (the Quick Compile) option.
	
	-or-
	
	2. Use the _based keyword to define a location within the code
	   segment. The following sample illustrates this:
	
	      int _based(_segname("_CODE")) savess;
	      void foo(void)
	      {
	          _asm mov savess, SS
	      }
	
	Sample Code
	-----------
	
	 1. void foo(void)
	 2. {
	 3.    _asm
	 4.    {
	 5.       jmp label
	 6.       nop
	 7.       nop
	 8.       nop
	 9.    label:
	10.       mov CS:WORD PTR $-4, SS
	11.    }
	12. }
