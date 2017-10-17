---
layout: page
title: "Q32816: The Cause of Run-Time Error R6000 Stack Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q32816/
---

## Q32816: The Cause of Run-Time Error R6000 Stack Overflow

	Article: Q32816
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	The run-time error R6000 Stack Overflow can be caused by two
	different problems, as follows:
	
	1. Your program's stack is not large enough to hold all the data
	   being pushed on it during execution of your program, so it
	   overflowed. This problem can be caused by heavily recursive
	   programs and programs that declare large amounts of data on
	   the stack ("local" or "automatic" data in C jargon).
	
	   In this case, you need a larger stack or less recursion and/or less
	   local data.
	
	2. The second cause for the R6000 error is somewhat counter
	   intuitive; it can be caused by the C startup (initialization)
	   code when it tries to allocate space for the stack and is unable
	   to do so.
	
	   In this case, you need to reduce the size of your stack or reduce
	   the amount of data in DGROUP.
	
	The following is a description of both problems, ways to solve the
	problem, and a method for determining which problem you are
	encountering:
	
	Case 1: R6000 Occurs at Run Time
	
	The stack overflowed because too much information was pushed on it.
	This information could be either function-return addresses or local
	data. Each time a function is called, the return address in the
	calling function is pushed on the stack along with any parameters;
	then, when the called function executes, it may allocate local
	("automatic") data for its own use. This process requires stack space.
	
	To correct this problem, do one of the following:
	
	1. Decrease the number of local variables, perhaps by declaring
	   those variables as static so they will not be pushed on the
	   stack.
	
	2. Increase the stack size by compiling with the /F x option, where
	   x is a hexadecimal number representing the number of bytes
	   desired in the stack size (see Page 102 of the "Microsoft C 5.1
	   Optimizing Compiler User's Guide").
	
	3. Change the stack size by linking with the /STACK switch, or using
	   the EXEMOD utility. Note that increasing the stack size too much
	   can cause an R6000 as described in case 2.
	
	Case 2: R6000 Occurs at Startup
	
	The startup code allocates space for the stack in the segment DGROUP.
	If DGROUP does not contain room for the specified stack size (default
	= 2K), the startup code issues the R6000 error.
	
	To correct this problem, either reduce the size of the stack or reduce
	the amount of data in DGROUP. To reduce the stack size, compile with
	the /F option, or link with the /STACK option, or use the EXEMOD
	utility. To reduce the amount of data in DGROUP, try switching from a
	small-data model (Small- or Medium-memory model) to a large-data model
	(Compact-, Large-, or Huge-memory model). If you already are in a
	large-data model, compile with the /Gt switch to move data from DGROUP
	to far data segments.
	
	To use the /Gt switch, specify /Gtx, where x is some decimal value
	representing a number of bytes. Data items larger than x bytes are
	allocated a new segment, thereby freeing up more space in DGROUP for
	the stack. For more information, see Page 156 of the "Microsoft C 5.1
	Optimizing Compiler User's Guide."
	
	How to Determine What is Causing the R6000 Error
	
	An excellent way to determine the cause of the problem is to use the
	CodeView debugger. After invoking CodeView on your program, execute to
	the beginning of function main() by doing one of the following:
	
	1. Single-Step with F8 or T.
	2. Enter "g main" at the CodeView prompt.
	
	When you've executed past the open curly-brace of main(), the C
	startup code has done its job by allocating space for stack and data.
	If the R6000 error does not occur at this time, you are experiencing
	Case 1, a run-time stack overflow (as opposed to Case 2, a
	startup-time stack overflow); you now can take appropriate action as
	described above.
