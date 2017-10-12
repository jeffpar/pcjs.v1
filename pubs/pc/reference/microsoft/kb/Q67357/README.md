---
layout: page
title: "Q67357: Void _saveregs Function Does Not Preserve AX Register"
permalink: /pubs/pc/reference/microsoft/kb/Q67357/
---

	Article: Q67357
	Product: Microsoft C
	Version(s): 
	Operating System: 6.00 6.00a | 6.00 6.00a
	Flags: MS-DOS     | OS/2
	Last Modified: 15-FEB-1991
	
	ENDUSER | s_quickc buglist6.00 buglist6.00a
	
	Functions with a void return type that are declared with the _saveregs
	attribute do not preserve the AX register. An arbitrary return value
	is stored in AX unnecessarily.
	
	The C online help states the following:
	
	   The _saveregs keyword causes the compiler to generate code that
	   saves and restores all CPU registers when entering and exiting the
	   specified function. Note that _saveregs does not restore registers
	   used for a return value (the AX register, or AX and DX).
	
	The second sentence states that AX will not be preserved whenever
	there is a return value, but a void function has no return value.
	Thus, there is no reason the AX register should not be preserved.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC version 2.50 (buglist2.50). We are researching this
	problem and will post new information here as it becomes available.
