---
layout: page
title: "Q65301: C1001: Internal Compiler Error: '@(#)regMD.c:1.100', Line 929"
permalink: /pubs/pc/reference/microsoft/kb/Q65301/
---

	Article: Q65301
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	In certain instances the compiler will generate the following
	internal compiler error:
	
	   fatal compiler error C1001: Internal Compiler Error
	   (compiler file '@(#)regMD.c:1.100' line 929)
	   Contact Microsoft Product Support Services
	
	In cases where this error is generated, there are several ways to work
	around the problem. Compiling with the /Od option is one way to
	correct the error, but it may not be needed. You may also want to try
	other optimizations and if you find the one that causes the error, use
	the optimize pragma to remove that optimization from the function in
	question. Other workarounds include breaking-up the code into smaller
	modules and/or simplifying the expression that the failure occurs on.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
