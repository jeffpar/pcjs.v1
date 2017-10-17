---
layout: page
title: "Q30880: FIX(N!&#42;10^2) Gives Different Results in .EXE and QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q30880/
---

## Q30880: FIX(N!&#42;10^2) Gives Different Results in .EXE and QB.EXE

	Article: Q30880
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The following code example using the FIX function produces different
	results inside the QB.EXE environment and as an executable EXE file.
	Compiling the program with the BC /O compiling option and the debug
	(/d) option does not affect the results.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in the Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This
	problem has been corrected in the Microsoft BASIC Compiler Version
	7.00 (fixlist7.00).
	
	The following code example demonstrates the problem:
	
	   N! = -21
	   PRINT FIX(N! * 10 ^ 2)
	
	The following is a workaround for the problem:
	
	   N! = -21
	   PRINT FIX(N!) * 10 ^ 2
