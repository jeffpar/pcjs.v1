---
layout: page
title: "Q67440: Tracing into a Macro When Debugging Assembly Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q67440/
---

## Q67440: Tracing into a Macro When Debugging Assembly Programs

	Article: Q67440
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 6-FEB-1991
	
	When you use a macro in an assembly-language routine and you are
	debugging, you cannot trace into the macro definition as you can with
	a procedure. The debugger simply executes the macro call (steps over
	it) as if it were a single instruction.
	
	This behavior is by design. There is no symbolic information
	generated to allow the debugger to step into the macro. If you are
	using CodeView, you can switch to assembler mode (not source mode) and
	single step through the code. However, if you are using Microsoft
	Quick Assembler, you will have to expand the macro before assembly if
	you want to step through the code.
	
	Note: There is a CodeView update for Quick Assembler version 2.51
	owners. Call Microsoft Sales and Service at (800) 426-9400 for more
	information.
