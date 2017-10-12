---
layout: page
title: "Q64437: A.P.T. Omits /NOI Requirement for Linking with C Run-Time DLL"
permalink: /pubs/pc/reference/microsoft/kb/Q64437/
---

	Article: Q64437
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 19-JAN-1991
	
	On Page 412 of the "Advanced Programming Techniques" manual that
	shipped with C version 6.00 and 6.00a, there are examples of compile
	and link lines for building a program that calls a DLL version of the
	C run-time library. The LINK command-line fails to include the /NOI
	option, which is necessary for the program to load properly.
	
	The linker can resolve calls to the run-time DLL without /NOI because
	the import library contains the function names needed, but then the
	linker will write out the function names to the .EXE with the wrong
	case. For example, if a program calls printf() and it is linked
	without /NOI, it will have _PRINTF written to the .EXE. The loader
	will then look for _PRINTF in the DLL, while the actual function in
	the DLL is _printf.
	
	As a result, everything seems to compile and link correctly, but when
	you try to run the program, you will get a SYS2070 error: The system
	could not demand load the application segment.
	
	If you build from within the Programmer's WorkBench (PWB), the /NOI is
	inserted automatically and everything works correctly.
