---
layout: page
title: "Q59539: ICE Error When Casting Pointer Arithmetic Result"
permalink: /pubs/pc/reference/microsoft/kb/Q59539/
---

	Article: Q59539
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 buglist2.01
	Last Modified: 29-MAY-1990
	
	When casting the result of pointer arithmetic to either a double or a
	float, QuickC Version 2.00 or QuickAssembler Version 2.01 may produce
	the following internal compiler error when compiling in small, medium,
	compact, or large models:
	
	   ice.c(7) : fatal error C1001: Internal Compiler Error
	         (compiler file 'gencode.c', line 389)
	         Contact Microsoft Technical Support
	
	Turning off all optimizations by use of the /Od switch does not help.
	
	Sample Code
	-----------
	
	void main(void)
	{
	   char * foo = "abcdef",
	        * bar = foo + 5 ;
	   double dbl;
	
	   dbl = (double) (foo-bar) ;
	}
	
	Substituting "float" for "double" produces the same error.
	
	The problem can be solved by using a temporary variable of type int to
	store the result of the pointer arithmetic. Type int is used because
	in all models (except huge), pointer arithmetic is done in 2-byte
	signed (that is, int) arithmetic.
	
	The following is the same as the above example, but uses a temporary
	variable to store the result of the pointer arithmetic.
	
	void main(void)
	{
	   char * foo = "abcdef",
	        * bar = foo + 5 ;
	   double dbl ;
	   int    temp ;
	
	   temp = foo-bar ;
	   dbl  = (double) temp ;
	}
	
	Microsoft has confirmed this to be a problem with QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
