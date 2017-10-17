---
layout: page
title: "Q28855: CINT and Integer Assignments Round x.5 to Nearest Even Integer"
permalink: /pubs/pc/reference/microsoft/kb/Q28855/
---

## Q28855: CINT and Integer Assignments Round x.5 to Nearest Even Integer

	Article: Q28855
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 25-APR-1989
	
	When a numeric expression ending in .5 is assigned to an integer
	variable, a compiled BASIC program will round the expression to the
	nearest even integer. For example, .5 converts to 0, 1.5 converts to
	2, 2.5 converts to 2, and 3.5 converts to 4.
	
	This rounding to the nearest even integer occurs for the CINT function
	and for an integer division assigned to an integer variable. This
	behavior is a feature of the IEEE Floating Point Standard.
	
	This behavior occurs in any BASIC application that uses the IEEE
	Floating Point format, including the following products:
	
	1. Microsoft QuickBASIC Versions 4.00, 4.00b, and 4.50
	
	2. The coprocessor version of QuickBASIC Version 3.00: QB87.EXE
	
	3. The Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2 (when compiled with the BC /FPi option, where "i" stands
	   for IEEE)
	
	This type of integer rounding complies with the following IEEE
	standard:
	
	   "If the difference between the unrounded operand and the rounded
	   result is exactly one half, the rounded result is even" (Section
	   5.5 of the "IEEE Standard for Binary Floating-Point Arithmetic")
	
	The purpose of this behavior is to prevent an average upward (or
	downward) bias as various calculations are rounded. If the number was
	always rounded up, there would be an upward bias in calculations.
	Rounding to the nearest even number averages out; therefore, no
	rounding bias occurs.
	
	The compilers listed above store and manipulate numbers using IEEE
	format. This exclusive use of IEEE format for real numbers is
	necessary to enable compiled BASIC to CALL routines written in
	FORTRAN, Pascal, and C, all of which use IEEE format.
	
	B.EXE (noncoprocessor) Version 3.00 and QuickBASIC Versions 1.00,
	1.01, 1.02, 2.00, and 2.01 all store numbers in Microsoft Binary
	Floating Point format. Note that QB87.EXE, the coprocessor version of
	QuickBASIC Version 3.00, uses IEEE format. QuickBASIC Versions 1.x,
	2.00, and 2.01 do not support IEEE (or 8087, 80287, or 80387)
	coprocessors.
	
	Microsoft Binary format uses a standard different from that of IEEE
	for converting between floating point and integers. In particular,
	numbers with "5" as the least significant digit are always rounded up
	to the next integer. The result does not have to be an even number.
	Thus, the Microsoft Binary format has an upward rounding bias.
	
	Note that QuickBASIC Versions 3.00 and earlier cannot make
	interlanguage CALLs to FORTRAN, Pascal, or C.
	
	The following are two examples of the above rounding behavior:
	
	1. The following is an example of always rounding expressions ending
	   in .5 to an even number by integer assignment:
	
	   DEFINT A-Z
	   INPUT "Type a whole number (1,2,3,4,5,6,...)",INUM
	   IRESULT=INUM/2
	   PRINT "If INUM/2 ends in .5, it rounds/truncates to even number:"
	   PRINT IRESULT
	
	2. The following is an example of rounding of the CINT() function:
	
	      a=.5
	      b=1.0
	      c=1.5
	      d=2.0
	      e=2.5
	      cls
	      print "CINT (0.5) = "; CINT(A)
	      PRINT "CINT (1.0) = "; CINT(B)
	      PRINT "CINT (1.5) = "; CINT(C)
	      PRINT "CINT (2.0) = "; CINT(D)
	      PRINT "CINT (2.5) = "; CINT(E)
	
	OUTPUT FROM:      B.EXE 4.00    |    B.EXE 3.00, 2.01, 2.00
	
	CINT (0.5) =           0        |         1
	CINT (1.0) =           1        |         1
	CINT (1.5) =           2        |         2
	CINT (2.0) =           2        |         2
	CINT (2.5) =           2        |         3
