---
layout: page
title: "Q48089: Description of the /Or Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q48089/
---

## Q48089: Description of the /Or Switch

	Article: Q48089
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 16-JAN-1990
	
	Question:
	
	When I run CL with the /HELP option to get command-line help, there is
	listed an optimization flag, /Or, that is supposed to disable in-line
	returns. I can't find information about this switch documented
	anywhere else. What does this switch really do?
	
	Response:
	
	The term "in-line return" is misleading; there is not a call to the
	return function that is eliminated. The /Or switch affects the code
	that is produced for functions lacking local variables and/or formal
	parameters.
	
	If a function takes no formal parameters and has no local variables, a
	stack frame is not necessary. /Or prevents stack frame creation and
	clean-up code from being produced when possible. The code for
	preservation and restoration of the SI and DI registers is also
	eliminated.
	
	The typical instructions that are eliminated are as follows:
	
	   push bp     ; This code is used on entry
	   mov  bp, sp ; to establish a stack frame.
	   ...
	   push di     ; This code is used on entry
	   push si     ; to preserve SI and DI.
	   ...
	   ...         ; The code to perform the function
	   ...         ; would be here.
	   ...
	   pop  si     ; This code is used on exit to
	   pop  di     ; restore SI and DI, and to
	   mov  sp, bp ; clean up the established
	   pop  bp     ; stack frame.
