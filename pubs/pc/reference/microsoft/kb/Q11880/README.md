---
layout: page
title: "Q11880: Negative Array Subscripts Checked with Debug, /D"
permalink: /pubs/pc/reference/microsoft/kb/Q11880/
---

## Q11880: Negative Array Subscripts Checked with Debug, /D

	Article: Q11880
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	Question:
	
	I have two questions on subscripts in QuickBASIC, as follows:
	
	1. What is supposed to happen when I use negative array subscripts in
	   QuickBASIC?
	
	2. Does QuickBASIC check the validity of subscripts?
	
	Response:
	
	The following are responses to your questions:
	
	1. Negative subscripts are not supported in Versions 3.00 and earlier,
	   so when you use negative subscripts, the results are unpredictable.
	   Versions 4.00 and later support the "TO" optional syntax, which allows
	   for subscripts in the range of -32768 to 32767. However, invalid
	   subscripts, such as negative values in Versions 3.00 and later, and
	   subscripts out of range in all versions, are not checked for unless
	   you have compiled with /D.
	
	   For example, compile the following program with BC.EXE without /D:
	
	      DIM A(10), B(10)
	      A(9) = 1
	      A(10) = 2
	      PRINT B(-1)  'the value printed is 2, which is value of A(10)
	      PRINT B(-2)  'the value printed is 1, which is the value of A(9)
	      END
	
	      Since BASIC may move items around in memory, the above results
	      might not occur if there were other operations between the
	      assignment statements and the PRINT statements.
	
	2. QuickBASIC checks subscript range validity when the /D switch is
	   on, or when the Debug option is selected in the editors in Versions
	   2.x and 3.00.
