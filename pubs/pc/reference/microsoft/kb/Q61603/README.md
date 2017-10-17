---
layout: page
title: "Q61603: TEXT.C Can Cause a Protection Violation Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q61603/
---

## Q61603: TEXT.C Can Cause a Protection Violation Under OS/2

	Article: Q61603
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 29-MAY-1990
	
	If the example file TEXT.C (obtained from the C Compiler version 6.00
	online help) is compiled using the large memory model and the OS/2
	protected mode libraries, the following operating system error may
	occur:
	
	   SYS1943: A program caused a protection violation.
	
	To reproduce this problem, cut the example program out of the online
	help and save it to a file named TEXT.C. Then compile with the
	following command line:
	
	   cl /AL /Zp text.c grtextp.lib
	
	Upon invoking TEXT.EXE, the SYS1943 message will be displayed and the
	program will exit.
	
	Due to a problem with the _outtext() function, compiling this program
	in large memory model produces the protection violation.
	
	As a workaround, if you compile the program with the small memory
	model (/AS), the program will run properly.
	
	Microsoft has confirmed this to be a problem with the C Compiler
	version 6.00. We are researching this problem and will post new
	information here as it becomes available.
