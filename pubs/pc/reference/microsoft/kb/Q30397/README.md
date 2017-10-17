---
layout: page
title: "Q30397: Bad Math in EXE Using Dynamic Array of Long Integers: Use /D"
permalink: /pubs/pc/reference/microsoft/kb/Q30397/
---

## Q30397: Bad Math in EXE Using Dynamic Array of Long Integers: Use /D

	Article: Q30397
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-NOV-1988
	
	Microsoft recommends compiling with the debug option (BC /D) whenever
	arrays are being used. If a math problem involving arrays is corrected
	by compiling with the debug (/D) option, that program must be compiled
	with the debug option.
	
	When using dynamic long-integer arrays in some math calculations in
	the EXE program, the results may not be correct unless you compile
	with the BC.EXE debug option (BC /D). The example below demonstrates
	this behavior.
	
	Inside the QB.EXE environment, the debug option always is on (and
	cannot be disabled); this means the math problem does not occur when
	programs are run in QB.EXE.
	
	The sample program below demonstrates the importance of the debug (BC
	/D) option, which does the following:
	
	1. Generates debugging code for run-time error checking
	
	2. Enables the CTRL+BREAK command to break a program
	
	3. Executes array-boundary checking
	
	Compiling with the debug option in the sample program below is
	essential to making the program work correctly.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, and Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and OS/2.
	
	The sample program is as follows:
	
	DEFLNG A-Z
	' $DYNAMIC
	DIM a(100) as LONG, b(100) as long
	a(1) = 25
	b(1) = 100
	r = 1
	x = -3
	CLS
	PRINT (r - x) * b(1) + a(1)
	PRINT a(1) + (r - x) * b(1)
	END
