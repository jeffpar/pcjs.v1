---
layout: page
title: "Q26588: FPSEG() and FP_OFF() Require DOS.H to Avoid C2106 Error"
permalink: /pubs/pc/reference/microsoft/kb/Q26588/
---

## Q26588: FPSEG() and FP_OFF() Require DOS.H to Avoid C2106 Error

	Article: Q26588
	Version(s): 5.00 5.10 6.00 6.00a | 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Problem:
	
	When I use the FP_SEG() and FP_OFF() macros on the left side of an
	assignment statement to set (rather than get) segment and offset
	values, the compiler generates the error, "C2106: left operand must be
	an lvalue."
	
	Response:
	
	You must include the DOS.H header file in your program; otherwise, the
	compiler believes FP_SEG() and FP_OFF() are function calls rather than
	macro definitions. Because a function is not an lvalue, it generates
	the C2106 error. For more information on the FP_SEG() and FP_OFF()
	macros, consult the run-time library reference or online help that
	shipped with your version of the compiler.
