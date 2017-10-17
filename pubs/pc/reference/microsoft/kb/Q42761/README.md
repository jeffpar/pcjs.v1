---
layout: page
title: "Q42761: Use /Op to Avoid Floating-Point Optimization Problem"
permalink: /pubs/pc/reference/microsoft/kb/Q42761/
---

## Q42761: Use /Op to Avoid Floating-Point Optimization Problem

	Article: Q42761
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890216-12181
	Last Modified: 17-MAY-1989
	
	The program below fails when compiled without an /O? option, but works
	if compiled with /Od. The problem seems to be in the conversion of the
	double to int -- the rounding seems to be done incorrectly.
	
	When the code is optimized, the result of the division is kept on the
	floating-point stack rather than being stored into memory and reloaded
	onto the stack. This causes precision problems because the numbers on
	the stack are stored in extended (10- byte) precision while doubles in
	memory are stored using 8 bytes.
	
	Note that the constant 23.31 cannot be represented exactly in the
	binary floating-point scheme used by Microsoft C. The fact that it is
	represented slightly small and then multiplied by 100 (magnifying the
	error) contributes to this problem.
	
	To avoid this problem, use the /Op option when compiling. The /Op
	switch forces in-memory storage of intermediate results. /Op can be
	combined with other optimizations (for instance, /Oxp).
	
	Program Example
	
	/*
	
	  When the following program is compiled using default optimization,
	  the program prints 2330 instead of 2331 (as it is supposed to.)
	  Also, if the commented line is uncommented, the program works
	  correctly with default optimization.
	
	*/
	
	#include <stdio.h>
	void main(void)
	{
	    int a;
	    double f;
	    f = 23.31;
	    f = f * 100;
	    /* printf(">%g<\n", f); */
	    a = (int)f;
	    printf(">%d<\n",a);
	    return;
	}
