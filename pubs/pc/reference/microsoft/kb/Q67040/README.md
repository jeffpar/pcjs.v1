---
layout: page
title: "Q67040: /Ol Causes register Variables to Be Allocated on the Stack"
permalink: /pubs/pc/reference/microsoft/kb/Q67040/
---

## Q67040: /Ol Causes register Variables to Be Allocated on the Stack

	Article: Q67040
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 28-NOV-1990
	
	In most cases, a variable declared with the register storage-class
	will not be allocated to a register if loop optimization (/Ol) is
	enabled. Instead, the compiler will place the variable on the stack.
	
	Only if the function contains an inline assembly (_asm) block will the
	register storage be allocated, due to the fact that inline assembly
	takes precedence over optimization. This is reflected by the following
	warning message, which is generated when /Ol is used on a function
	with an _asm block:
	
	   warning C4204: in-line assembler precludes global optimizations
	
	The sample program below demonstrates both of the situations described
	above. If the program is compiled as is with /Ol, the register
	declared variable "i" will not be put in a register; it will be
	handled exactly like "j", which is not declared with register
	storage-class.
	
	If the line at the end of main() with the _asm block is uncommented,
	then "i" will be allocated storage in a register and the C4204 warning
	will be displayed if the warning level is set at 3 or 4 (/W3 or /W4).
	To see the difference, you can generate an assembly listing with /Fa,
	or you can compile and link the program with CodeView information and
	then view the mixed source and assembly listing in the debugger.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	int foo(void);
	
	void main(void)
	{
	    register int i = 7;
	    int          j = 9;
	
	    while ( i < 10 ) {
	       i += foo();
	       j += foo();
	    }
	
	    /* Uncomment the following line to have i put in a register */
	    /* _asm xor i,i */
	}
	
	int foo(void)
	{
	   return (1);
	}
