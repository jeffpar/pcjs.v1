---
layout: page
title: "Q62830: X=(-1&#42;W)^2 Gives &quot;Division by Zero&quot; on 386 with 387; BASIC 7.1"
permalink: /pubs/pc/reference/microsoft/kb/Q62830/
---

## Q62830: X=(-1&#42;W)^2 Gives &quot;Division by Zero&quot; on 386 with 387; BASIC 7.1

	Article: Q62830
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist7.00 buglist7.10
	Last Modified: 6-AUG-1990
	
	Executing the following line of code on a 80386 machine equipped with
	an 80387 math coprocessor results in a "Division by zero" error:
	
	   X = (-1 * W) ^ 2
	
	The "Division by zero" error occurs in both the QBX.EXE environment
	and within a compiled .EXE in Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10. The error occurs only on 80386
	computers with 80387 coprocessors.
	
	Microsoft has confirmed this to be a problem with Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available. This problem does not occur
	with other Microsoft BASIC products.
	
	The following are two workarounds for the above problem:
	
	1. Use the DOS command SET NO87=NONE to disable BASIC's use of the 387
	   coprocessor. The program will then execute correctly. Note that
	   disabling BASIC's use of the coprocessor usually slows program
	   execution.
	
	2. Change the line of code into two lines, using a temporary variable
	   to hold the value of (-1 * W), as follows:
	
	      TEMP = (-1 * W)
	      X = TEMP ^ 2
