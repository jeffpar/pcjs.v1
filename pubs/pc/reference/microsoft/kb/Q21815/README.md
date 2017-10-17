---
layout: page
title: "Q21815: Cannot Access FIELDed Variables After CLOSE in Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q21815/
---

## Q21815: Cannot Access FIELDed Variables After CLOSE in Compiled BASIC

	Article: Q21815
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 15-MAR-1989
	
	Problem:
	
	I cannot access FIELDed variables after I close the random access
	file. I am able to access the variables in IBM BASICA, but not in the
	QuickBASIC compiler.
	
	Response:
	
	This is a difference between the IBM BASICA Interpreter and the
	QuickBASIC Compiler.
	
	You must assign the FIELDed variables to unFIELDed string variables to
	access the data in the FIELD buffer after the file is closed.
	
	Note: If the file is closed, and a FIELD variable is used as an
	argument to a function, you may receive an "Illegal Function Call"
	message.
	
	This information needs to be added to Appendix A "Converting BASICA
	Programs to QuickBASIC" in the following manuals:
	
	1. "Microsoft BASIC Compiler Version 6.00 for MS OS/2 and MS-DOS:
	   Learning and Using Microsoft QuickBASIC"
	
	2. "Microsoft QuickBASIC: Programming in BASIC Version 4.50"
	
	This information can also be added to Chapter 10,
	"Compiler-Interpreter Language Differences," of the "Microsoft
	QuickBASIC Compiler" Versions 2.0x and 3.00 manual.
