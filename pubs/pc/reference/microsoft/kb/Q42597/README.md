---
layout: page
title: "Q42597: Using Near Addresses in Interrupt Handlers in C"
permalink: /pubs/pc/reference/microsoft/kb/Q42597/
---

## Q42597: Using Near Addresses in Interrupt Handlers in C

	Article: Q42597
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	When the Microsoft C Compiler compiles the sample program below for
	the small or medium memory model, it gives the following warning:
	
	   warning C4058: address of frame variable taken, DS != SS
	
	The sample program is as follows:
	
	/* sample program */
	void interrupt far handler (void) ;
	void foo (char *) ;
	
	void interrupt far handler (void)
	{
	char ch ;
	foo (&ch) ;
	}
	
	void foo (char * ptr)   /* a trivial function */
	{
	*ptr = 'a' ;
	}
	
	The warning is generated because the Microsoft C Compiler assumes that
	DS is equal to SS. Because the stack segment SS could possibly be
	changed in an interrupt service routine, the compiler gives a warning
	when a near address that refers to a stack location is passed to a
	function.
	
	In general, in the small and medium memory models, data pointers are
	defaulted to be near unless the "far" keyword is used. In the example
	above, the function "foo" is expecting a near address that is a 16-bit
	offset. A function such as "foo" has no way to tell if the near
	pointer passed to it is an offset relative to the data segment or the
	stack segment. Therefore, the C compiler makes the assumption that an
	offset by itself is always relative to the default data segment. This
	is not a problem in the normal case, where we can depend on the
	assumption that the C compiler makes SS equal to DS. However, in the
	example above, the stack segment could be changed in the interrupt
	handling routine; therefore, the compiler warns you that the code may
	not work correctly.
	
	If the memory model is large or compact, or if the "far" keyword is
	used when foo's formal parameter is declared, the compiler will not
	give any warnings. When "foo" is called, an address with the stack
	segment and the offset will be passed to the function automatically.
	Declaring the stack variable "ch" as static will also avoid the
	problem. The corrected source code is as follows:
	
	/* sample program */
	void interrupt far handler (void) ;
	void foo (char *) ;
	
	void interrupt far handler (void)
	{
	static char ch ;
	foo (&ch) ;
	}
	
	void foo (char * ptr)   /* a trivial function */
	{
	*ptr = 'a' ;
	}
