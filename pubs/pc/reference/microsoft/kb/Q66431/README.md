---
layout: page
title: "Q66431: How to Read Internal Floating-Point Function Names"
permalink: /pubs/pc/reference/microsoft/kb/Q66431/
---

## Q66431: How to Read Internal Floating-Point Function Names

	Article: Q66431
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 9-NOV-1990
	
	Question:
	
	I am looking at the .COD listing for an application compiled for
	Alternate Math using the Microsoft C version 6.00 compiler. While
	examining the generated code, I noticed that several functions are
	called in order to perform the floating-point calculations in my code.
	What does each function do?
	
	Response:
	
	The functions you see in the code perform a task similar to the 80x87
	instructions that would be needed for the same situation. Therefore,
	it is fairly easy to determine what the name of each function means
	and what the function does.
	
	Each name is composed of fields similar to the following
	
	   __a(far/near call)(segment)(operation)(data type)(reverse/pop)
	
	where
	
	   (far/near call) is either "F" or "N". This specifies that the
	                   altmath helper is called either far or near.
	
	   (segment)       is "f", "s", or "e". If the altmath helper
	                   needs an argument, the compiler will set BX to
	                   point to the argument. If the altmath routine
	                   has an "f" in its segment field, then DS:BX points
	                   to the argument. "s" means that SS:BX points to
	                   the argument and "e" means ES:BX. If no argument
	                   is needed, then "f" is used. (For example, __aNfadd
	                   doesn't need an argument but instead uses st(0)
	                   and st(1) off of the altmath stack, just like the
	                   "fadd" 80x87 instruction.)
	
	   (operation)     is similar to the 80x87 instructions. "add",
	                   "sub", "mul", "div", "ld" (load to altmath stack),
	                   and "st" (store from stack).
	
	   (data type)     is one of the following:
	
	                      "s" for single precision or float.
	                      "d" for double precision or double.
	                      "w" for word or 16 bit integer.
	                      "l" for long or 32 bit integer.
	                      "q" for qword or 64 bit integer.
	                      ''  for no data type needed.
	
	                   This field is used only when bx points to an
	                   argument.
	
	   (reverse/pop)   is "p", "r" or ''. In most cases, it is not
	                   used. If the operation was a "st" (store), then a
	                   "p" at the end means to pop the stack after the
	                   store. If the operation was div or sub, then an
	                   "r" means to do the reverse version of the
	                   operation.
	
	So, __aNfadds is a near called routine that will add the top of the
	altmath stack st(0) with the float (single precision) in DS:BX. This
	is similar to "fadd  dword ptr ds:[bx]" in 80x87 code.
