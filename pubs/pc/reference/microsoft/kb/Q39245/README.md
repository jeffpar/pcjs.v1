---
layout: page
title: "Q39245: BC.EXE &quot;Internal Error&quot; Using Passed Integers in Expression"
permalink: /pubs/pc/reference/microsoft/kb/Q39245/
---

## Q39245: BC.EXE &quot;Internal Error&quot; Using Passed Integers in Expression

	Article: Q39245
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 27-FEB-1990
	
	An "internal error" is produced when compiling the sample code
	fragment (below) with BC.EXE. The problem relates to a compiler
	code-optimization problem in a particular case of passing integer
	variables as parameters to a subprogram and using them in certain
	expressions.
	
	Microsoft has confirmed this to be a problem in BC.EXE in Microsoft
	QuickBASIC Versions 4.00, 4.00b, and 4.50, and in the BASIC Compiler
	Versions 6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00,
	buglist6.00b). This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00)
	
	To work around this problem, assign a temporary value to one of the
	integer parameters before doing arithmetic (see below).
	
	The following code example causes an "internal error":
	
	DECLARE SUB XSCROLL (BarLen%, LCol%, BRow%, Rcol%)
	SUB XSCROLL (BarLen%, LCol%, BRow%, Rcol%)
	   LCol% = LCol% + 3
	   NumCol# = ((Rcol% - LCol%) + 1) \ BarLen%
	END SUB
	
	The following code example works around the problem:
	
	DECLARE SUB XSCROLL (BarLen%, LCol%, BRow%, Rcol%)
	SUB XSCROLL (BarLen%, LCol%, BRow%, Rcol%)
	   temp1% = LCol%
	   temp1% = temp1% + 3
	   LCol% = temp1%
	   NumCol# = ((Rcol% - LCol%) + 1) \ BarLen%
	END SUB
