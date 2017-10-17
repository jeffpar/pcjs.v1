---
layout: page
title: "Q34279: Cannot Pass More Than 21 Dynamic Array Elements to Subprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q34279/
---

## Q34279: Cannot Pass More Than 21 Dynamic Array Elements to Subprogram

	Article: Q34279
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	Passing more than 20 individual elements of a dynamic array to a
	subprogram or function procedure will produce the compiler error "Too
	many arguments in function call." This limitation occurs for all types
	of dynamic arrays. Either the whole array should be passed, or each
	item should be copied to a temporary variable and then passed to the
	subprogram or function.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50, to the Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	This limitation occurs because of special handling done for dynamic
	arrays. When a subprogram is called, there is no way of ensuring that
	the dynamic array will not move. Therefore, when individual array
	elements are passed by reference, each is copied into a temporary
	location. These temporary locations are passed to the routine and then
	reassigned to the array when the routine is exited. There is a limit
	of 20 temporary locations.
	
	The following is a complete code example:
	
	DECLARE SUB test2 (a1!, a2!, a3!, a4!, a5!, a6!, a7!, a8!, a9!,_
	                   a10!, a11!, a12!, a13!, a14!, a15!, a16!, a17!,_
	                   a18!, a19!, a20!, a21!)
	x = 30
	DIM a(x)
	CALL test2(a(1), a(2), a(3), a(4), a(5), a(6), a(7), a(8), a(9),_
	           a(10), a(11), a(12), a(13), a(14), a(15), a(16), a(17),_
	           a(18), a(19), a(20), a(21))
	END
	
	SUB test2 (a1!, a2!, a3!, a4!, a5!, a6!, a7!, a8!, a9!, a10!, a11!,_
	           a12!, a13!, a14!, a15!, a16!, a17!, a18!, a19!, a20!, a21!)
	
	    PRINT "hello"
	
	END SUB
	
	The following is the compiler output:
	
	Microsoft (R) QuickBASIC Compiler Version 4.00b
	Copyright (C) Microsoft Corp. 1982-1988. All rights reserved.
	 0053   0006  ...a(18),a(19),a(20),a(21))
	                                   ^ Too many arguments in function call
	
	43059 Bytes Available
	37660 Bytes Free
	
	    0 Warning Error(s)
	    1 Severe  Error(s)
