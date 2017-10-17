---
layout: page
title: "Q40413: Recursive FUNCTION Procedure Shouldn't Be STATIC in QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q40413/
---

## Q40413: Recursive FUNCTION Procedure Shouldn't Be STATIC in QuickBASIC

	Article: Q40413
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S890111-178 B_BasicCom
	Last Modified: 8-DEC-1989
	
	Further below is a correction that applies to the factorial example
	program (in the Recursive Procedures section) in the following
	manuals:
	
	1. Page 82 of "Microsoft QuickBASIC 4.0: Programming in BASIC:
	   Selected Topics" (for QuickBASIC 4.00 and 4.00b)
	
	2. Page 82 of "Microsoft BASIC Compiler 6.0 for MS OS/2 and MS-DOS:
	   Programming in BASIC: Selected Topics" (for 6.00 and 6.00b)
	
	3. Page 72 of "Microsoft QuickBASIC 4.50: Programming in BASIC"
	
	4. Page 68 of "Microsoft BASIC Version 7.0: Programmer's Guide"
	
	In the factorial function, the STATIC clause should be removed from
	the FUNCTION line so that it reads as follows:
	
	   FUNCTION Factorial# (N%)
	
	The example on this page incorrectly defines the recursive function to
	be STATIC when it should actually be non-STATIC. Recursive functions
	should be defined as non-STATIC because the usefulness of a recursive
	function relies on automatic variables saved temporarily on the stack,
	instead of variables that retain their values between invocations.
	
	The function Factorial# depends on the value for N% to be correct in
	each level of the recursive iteration. The value for N% cannot be
	correct if the number is not stored on the stack with each recursive
	call.
