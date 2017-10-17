---
layout: page
title: "Q59608: A2071 and A2006 with Assembly Code from a C Program"
permalink: /pubs/pc/reference/microsoft/kb/Q59608/
---

## Q59608: A2071 and A2006 with Assembly Code from a C Program

	Article: Q59608
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | h_masm s_quickc s_quickasm fixlist6.00
	Last Modified: 15-APR-1990
	
	When using the /Fa switch (generate assembly language listing) and the
	/AL switch (large memory model) with C 5.10, the compiler will
	generate some slightly incorrect assembly code in the .ASM file. When
	this assembly code is run through MASM, MASM will give the following
	errors:
	
	   A2071:  Forward needs override or FAR
	   A2006:  Phase error between passes
	
	Specifically, these errors occur in a module that has a function
	calling another function within the same module. In this case, it is
	possible to make a NEAR call to the specified function. Because the
	function being called is a FAR function (in large memory model), CS
	must be pushed onto the stack to correct problems that arise.
	
	The assembly code produced by C 5.10 does not specify that the call to
	the function is NEAR, although it still pushes CS onto the stack prior
	to calling the function. Because the current memory model is large,
	and the type of call is not specified, a FAR call is assumed.
	
	When the function returns (with a RET), both CS and IP are popped off
	of the stack, which the call automatically put onto the stack. You are
	left with an extra CS still on the stack.
	
	To work around this problem, it is important to force a NEAR call to
	the function.
	
	The following is an example of the C code used to produce the
	assembly code:
	
	#include <stdio.h>
	
	void main (void);
	int  r1   (void);
	
	void main (void)
	{
	   printf ("Foo\n");
	   r1 ();
	   printf ("Bar\n");
	}
	
	int r1 (void)
	{
	   return (1);
	}
	
	The following is a piece of the assembly code, the important piece in
	this case:
	        .
	        .
	        .
	   push  cs
	   call  _r1
	   mov   WORD PTR [bp-2], ax  ; rc
	        .
	        .
	        .
	Because these procedures are both declared as FAR, it is assumed that
	this is a FAR call. Since that is the case, it is not necessary to
	push CS.
	
	To correct the problem, you can change the call to the following:
	        .
	        .
	        .
	   push  cs
	   call  NEAR PTR _r1
	   mov   WORD PTR [bp-2], ax  ; rc
	        .
	        .
	        .
	In this case, you are forcing the assembler to notice that only the
	offset is necessary on the stack. When the RET is encountered, both
	words (offset and segment) will be popped off of the stack.
	
	It is necessary to make these changes for each call to a function that
	can be made with a near call. Calls that are made to functions in
	another module are FAR by default because they are external, so they
	aren't a problem.
	
	If the .ASM code is assembled with Quick Assembler, the same errors
	will result if the two-pass option is turned on. With only one pass,
	the phase error is not generated. Either way, the same correction
	applies in both cases.
