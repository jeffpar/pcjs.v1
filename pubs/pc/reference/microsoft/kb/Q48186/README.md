---
layout: page
title: "Q48186: Compiling Incorrect or Incomplete C Syntax Can Hang Computer"
permalink: /pubs/pc/reference/microsoft/kb/Q48186/
---

## Q48186: Compiling Incorrect or Incomplete C Syntax Can Hang Computer

	Article: Q48186
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 buglist2.01
	Last Modified: 6-NOV-1989
	
	QuickC Versions 2.00 and 2.01 hang the computer when given certain
	unusual and obscure configurations of invalid C syntax.
	
	For example, compiling the code shown below causes QuickC to hang. The
	code can be compiled both inside and outside of the environment with
	various switches turned on/off, and a hang results.
	
	To work around the problem, correct the invalid or incomplete syntax.
	If you are unsure of the location of the syntax errors, then use the
	QCL command-line compiler to locate the lines containing the specified
	errors.
	
	Make note of these error messages and then reboot your machine. You
	should correct these particular syntax errors.
	
	Note: This particular behavior of QuickC occurs only with very unusual
	and invalid C syntax.
	
	Microsoft has confirmed this to be a problem with QuickC Version 2.00
	and 2.01. We are researching this problem and will post new
	information as it becomes available.
	
	The following example demonstrates the problem. To correct this
	problem, place _dos_findfirst within a function, and correct the
	existing function definitions.
	
	The source code for prg.c is as follows:
	
	_dos_findfirst
	
	void wrflen(value)
	long value;
	{
	     int buffer;
	
	     buffer = value;
	
	     for (;;) {
	     }
	}
	
	int wrvlen(value)
	long value;
	{
	     int buffer;
	
	     while (1) {
	     }
	}
	
	The QCL outputs the following text before hanging:
	
	Microsoft (R) Quick C Compiler Version 2.00
	Copyright (C) Microsoft Corp 1987-1989.  All rights reserved.
	
	prg.c (3) error C2054: expected '(' to follow '_dos_findfirst'
	prg.c (4) error C2085: 'wrflen': not in formal parameter list
	prg.c (4) error C2144: syntax error: missing ';' before type 'long'
	prg.c (8) error C2065: 'value': undefined
