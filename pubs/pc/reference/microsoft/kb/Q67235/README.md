---
layout: page
title: "Q67235: C1001: Internal Compiler Error: grammar.c, Line 140"
permalink: /pubs/pc/reference/microsoft/kb/Q67235/
---

	Article: Q67235
	Product: Microsoft C
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a
	Last Modified: 29-NOV-1990
	
	Compiling the sample code below with default optimizations and a
	memory model with far data (/AL or /AC) will result in the following
	error:
	
	   sample.c(15) : fatal error C1001: Internal Compiler Error
	                  (compiler file '../grammar.c', line 140)
	                  Contact Microsoft Product Support Services
	
	The following are valid workarounds:
	
	1. Compile with /Od (optimizations disabled).
	
	2. Use the optimize pragma to disable optimizations for the function
	   in which the error occurs.
	
	3. Compile in the small or medium memory model.
	
	4. Compile with the /qc (quick compile) option.
	
	5. Assign the "0 - msc.a" expression to a temporary variable, and
	   assign the temporary variable to msc.a on line 15.
	
	Sample Code
	-----------
	
	 1: void foo(void);
	 2: void sub(void);
	 3:
	 4: struct _msc
	 5: {
	 6:    long a;
	 7: };
	 8:
	 9: extern struct _msc msc;
	10:
	11: void sub()
	12: {
	13:    msc.a = 0 - msc.a;
	14:    foo();
	15:    msc.a = 0 - msc.a;
	16: }
	
	Microsoft has confirmed this to be a problem in C version 6.00a. We
	are researching this problem and will post new information here as it
	becomes available.
