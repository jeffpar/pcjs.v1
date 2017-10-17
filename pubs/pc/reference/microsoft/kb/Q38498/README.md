---
layout: page
title: "Q38498: &quot;Expression Too Complex&quot; Error when Compiling with BC.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q38498/
---

## Q38498: &quot;Expression Too Complex&quot; Error when Compiling with BC.EXE

	Article: Q38498
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50
	Last Modified: 29-NOV-1988
	
	The program below, which runs properly inside the QuickBASIC Version
	4.50 environment, will generate an "Expression too complex" error
	message when compiled with BC.EXE.
	
	Microsoft has confirmed this to be a problem in BC.EXE in QuickBASIC
	Version 4.50. We are researching this problem and will post new
	information as it becomes available.
	
	The program compiles and executes properly in Microsoft QuickBASIC
	Versions 4.00 and 4.00b.
	
	When the program listed below is compiled using BC.EXE, either from
	the DOS command line, or from the QuickBASIC environment with "Make
	.EXE File..." option, an "Expression too complex" error message is
	generated on the END SUB statement. The problem does not occur if the
	expression in the subprogram is simplified in any way (such as
	breaking the expression into two parts, using temporary variables,
	etc.), or if the array values in the subprogram are SHARED rather than
	passed as parameters.
	
	To avoid the problem, you can either break the expression in the
	subprogram down, using multiple expressions and temporary variables,
	or make the arrays SHARED rather than passed to the subprogram as
	parameters.
	
	The following is a code example:
	
	DEFINT A-Z
	DECLARE SUB cd (cur(), c(), b(), sn, l())
	DIM b(10), c(1, 10), cur(10, 2, 1, 6)
	DIM l(10)
	PRINT "This is a test."
	END
	'Note that the subprogram does NOT have to be CALLED
	'to reproduce the problem
	SUB cd (cur(), c(), b(), sn, l())
	  mp = cur(l(sn), 0, 1, c(0, sn)) - 1
	END SUB
