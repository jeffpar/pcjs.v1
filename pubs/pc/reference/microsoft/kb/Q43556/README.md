---
layout: page
title: "Q43556: Commands Invoked with "?" Command Must Be Compiled with /Zi"
permalink: /pubs/pc/reference/microsoft/kb/Q43556/
---

	Article: Q43556
	Product: Microsoft C
	Version(s): 2.20   | 2.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 3-MAY-1989
	
	Invoking C functions in CodeView using the "?" command works as
	expected as long as the function is contained in a module that was
	compiled with /Zi for the CodeView information. However, if you invoke
	a run-time library function, CodeView returns the error message
	"syntax error."
	
	The reason for the error message is that the module containing the
	library function is not compiled with the CodeView option /Zi. The
	error message is not dependent on the fact that the function is in the
	library rather than being user-defined. If a user-defined function is
	contained in a module that is compiled without /Zi for the CodeView
	information and you try to invoke it with the "?" command, CodeView
	will return the same error message.
	
	The "?" command is formally referred to in the CodeView Utilities
	menu as the Display Expression command.
