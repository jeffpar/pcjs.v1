---
layout: page
title: "Q67355: Compiler May Hang Under DOS When Using /qc and Memory Runs Out"
permalink: /pubs/pc/reference/microsoft/kb/Q67355/
---

	Article: Q67355
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	Under certain circumstances, the compiler may run out of memory when
	trying to compile a source module. In some situations, when both
	compiling under DOS and specifying the /qc option to invoke the quick
	compiler, an out-of-memory condition may result in garbage output
	being dumped to the screen, or the following error may be generated:
	
	   fatal error C1063: compiler limit : compiler stack overflow
	
	Depending on the particular code being compiled and the optimizations
	specified, the C1063 error may or may not contain any error text. In
	some cases, only the error number is displayed and then the computer
	hangs before the "compiler limit" message is displayed.
	
	This problem has been observed only with the real-mode quick compile
	option. Simplifying the code is one way to work around the problem.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
