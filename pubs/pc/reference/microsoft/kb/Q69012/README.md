---
layout: page
title: "Q69012: Use of OFFSET and SEG on Local Variables in Inline Assembly"
permalink: /pubs/pc/reference/microsoft/kb/Q69012/
---

## Q69012: Use of OFFSET and SEG on Local Variables in Inline Assembly

	Article: Q69012
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	Inline assembly allows you to use the SEG and OFFSET operators to get
	the segment and offset address of variables. However, if you use the
	SEG directive on a local variable, you will get the following error
	message in C versions 6.00 and 6.00a or QuickC versions 2.50 and 2.51:
	
	   error C2415: improper operand type
	
	You will not get this error with QuickC versions 2.00 and 2.01, and
	incorrect code will be generated. In all versions, using the OFFSET
	directive on a local variable will not directly give you a near
	pointer to the variable.
	
	It is important to remember that a local variable is placed on the
	stack at run time. Therefore, the compiler cannot determine its
	address at compile time. The value returned by OFFSET applied to a
	local variable actually is that variable's position on the stack
	relative to the BP register. Thus, adding the BP register to the
	OFFSET value will create a near pointer into the stack segment.
	
	Because the local variable is on the stack, the segment value of a
	local variable is simply the stack segment (SS) register. The
	following two sample programs demonstrate the incorrect and correct
	method to access a local variable address:
	
	Sample Code
	-----------
	
	// These programs show how you might try to load an address
	// of a local variable into the dx, ax register combination.
	
	// This is the wrong way to get a local variable address.
	
	void main(void)
	{
	   int foo;
	   _asm
	   {
	      mov ax, OFFSET foo
	      mov dx, SEG foo
	   }
	}
	
	// This is the right way to get a local variable address.
	
	void main (void)
	{
	   int foo;
	   _asm
	   {
	      mov ax, OFFSET foo
	      add ax, bp
	      mov dx, ss
	   }
	}
