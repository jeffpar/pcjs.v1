---
layout: page
title: "Q43901: Multiple CASE ELSE Allowed in QB.EXE; Causes Compile Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q43901/
---

## Q43901: Multiple CASE ELSE Allowed in QB.EXE; Causes Compile Errors

	Article: Q43901
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 2-MAR-1990
	
	The SELECT CASE statement allows multiple occurrences of the same CASE
	condition. Because a SELECT CASE statement operates in sequential
	order, the first instance of any CASE is always taken. If there are
	other CASE conditions listed after the CASE ELSE statement, these may
	cause the compiler errors "SELECT without END SELECT" and "END SELECT
	without SELECT."
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in the QB.EXE that is shipped with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b (buglist6.00
	buglist6.00b). This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	
	Code Example
	------------
	
	In the following code example, the QB.EXE environment will not produce
	an error. During compilation, the error "SELECT without END SELECT"
	occurs on the second CASE ELSE and the error "END SELECT without
	SELECT" occurs on the END SELECT.
	
	In the QBX.EXE environment that is shipped with PDS, the second CASE
	ELSE statement is flagged with the error message "CASE without
	SELECT."
	
	CLS
	DO
	INPUT "", x
	SELECT CASE x
	  CASE IS = 1
	    PRINT "ONE"
	  CASE IS = 2
	    PRINT "TWO"
	  CASE IS = 3
	    PRINT "THREE"
	  CASE IS = 3           'This CASE never chosen
	    PRINT "THREE 2"
	  CASE ELSE
	    PRINT "OTHER"
	  CASE ELSE             'This line causes "SELECT without END SELECT"
	    PRINT "OTHER 2"
	END SELECT              'This line causes "END SELECT without SELECT"
	LOOP UNTIL x = 0
