---
layout: page
title: "Q44927: How Does _osmode Get Set?"
permalink: /pubs/pc/reference/microsoft/kb/Q44927/
---

	Article: Q44927
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890523-18896
	Last Modified: 21-AUG-1989
	
	The Microsoft C Run-time Library variable _osmode is set to one (1)
	when running under OS/2 and to zero (0) when running under DOS. A C
	program can look at this variable and easily determine whether it's
	running under DOS or OS/2, without calling DosGetMachineMode.
	
	To declare the variable, use the following line:
	
	   #include <stdlib.h>
	
	An examination of the start-up code (included with the compiler) shows
	how the value of this variable is determined. The DOS start-up code
	just initializes the variable to zero. The OS/2 code initializes it by
	making a call to the OS/2 API DosGetMachineMode, which sets it to zero
	for DOS or one for OS/2. Thus, you don't need to make the call.
	
	If you compile for DOS (/Lr or /Lc), the DOS start-up code is included
	because the linker links your program with the appropriate DOS library
	(xLIBCyR, where x is the memory model and y is the math option). By
	the same token, when you compile with /Lp, the linker links the proper
	library for OS/2 (xLIBCyP). If you don't specify one of these options,
	your code is linked with xLIBCy.
