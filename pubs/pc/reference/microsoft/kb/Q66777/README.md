---
layout: page
title: "Q66777: Formal Parameter Cannot Be Based on Previous Formal Parameter"
permalink: /pubs/pc/reference/microsoft/kb/Q66777/
---

## Q66777: Formal Parameter Cannot Be Based on Previous Formal Parameter

	Article: Q66777
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 26-NOV-1990
	
	Based pointers and variables are introduced in Microsoft C version
	6.00. One limitation of based addressing is that a formal parameter to
	a function cannot be based on a previous formal parameter to the same
	function. For example, the compiler will generate an error for the
	following function definition, which has two formal parameters with
	the second parameter based on the first:
	
	   void foo( _segment myseg, int _based(myseg) *bptr )
	   {
	   }
	
	The first parameter (myseg) is of type segment, while the second is a
	based pointer to an integer (bptr) that is based on the myseg. If
	these same variable declarations are not part of a formal parameter
	list, they will compile without problem, but the above function will
	generate the following compiler error for the based variable:
	
	   error C2065: 'myseg' : undefined
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC versions 2.50 and 2.51 (buglist2.50 and buglist2.51).
	We are researching this problem and will post new information here as
	it becomes available.
