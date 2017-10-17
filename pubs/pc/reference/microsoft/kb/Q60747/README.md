---
layout: page
title: "Q60747: Quick Compiler Incorrectly Zero-Extends Ones Complement"
permalink: /pubs/pc/reference/microsoft/kb/Q60747/
---

## Q60747: Quick Compiler Incorrectly Zero-Extends Ones Complement

	Article: Q60747
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 s_quickc
	Last Modified: 19-APR-1990
	
	The C Version 6.00 quick compiler incorrectly zero-extends ones
	complement operations that result in negative integers, rather than
	sign-extending them. The QuickC (QC) 2.50 compiler works correctly.
	
	When compiled with the quick compiler, the following sample code
	produces a value of 64512 for l. When compiled with the full
	optimizing compiler, the correct result of -1024 is produced for l.
	This is a problem with QCL, not CL.
	
	In ANSI C, the constant 1023 is represented as an integer. The
	ones complement of 1023 (-1024) should remain an integer and when
	promoted to a long, this integer should then be sign-extended
	preserving the value. QCL correctly stores 1023 as an integer;
	however, it doesn't sign-extend the ones complement as it should.
	
	One solution is to typecast the ones complement to an int before
	assigning it to a long [for example, l=(int)~1023].
	
	Microsoft has confirmed this to be a problem with Version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
	
	Sample Code
	-----------
	
	#include<stdio.h>
	
	void main(void)
	{
	  long l;
	
	  l=~1023;  /* Ones complement not properly extended */
	
	  printf("%ld\n",l);
	}
