---
layout: page
title: "Q29923: FUNCTIONs and Subprograms Can Affect FIELDed Arrays in COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q29923/
---

## Q29923: FUNCTIONs and Subprograms Can Affect FIELDed Arrays in COMMON

	Article: Q29923
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50
	Last Modified: 22-JAN-1990
	
	An array that is in both a FIELD and a COMMON statement can be
	adversely affected if you pass it as a parameter to a FUNCTION or
	subprogram procedure.
	
	The program below has two FIELD statements that result in two arrays
	pointing to the same memory location. However, after a call to a
	FUNCTION that should not affect the arrays, they no longer point to
	the same place in memory. Compiling with debug (BC /D) does not help.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b), and in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2 (buglist7.00). We are researching this problem and
	will post new information here as it becomes available.
	
	The program works correctly in QuickBASIC Version 3.00 if the FUNCTION
	is made into a subprogram. (QuickBASIC Version 3.00 does not support
	FUNCTION procedures.)
	
	The following is an example using a FUNCTION, but the problem also
	occurs if the FUNCTION is made into a subprogram:
	
	DECLARE FUNCTION Nothing% (any$)
	DEFINT A-Z
	COMMON SHARED /GLOBAL/ field1$(), field2$()
	DIM field1$(20), field2$(20)
	CLS
	OPEN "anyfile.tmp" FOR RANDOM SHARED AS #1 LEN = 10
	FIELD #1, 10 AS field1$(1)
	FIELD #1, 10 AS field2$(1)
	
	'** NOTE: At this point, field1$(1) and field2$(1) should point to    **
	'** the same storage location (buffer space) as verified below.       **
	
	LSET field1$(1) = "ABC"
	PRINT field1$(1); field2$(1)
	LSET field2$(1) = "DEF"
	PRINT field1$(1); field2$(1)
	
	x = Nothing(field1$(1))     '** prints field1$ but should not change it. **
	'x = Nothing((field1$(1)))  '** passes by value -- this works **
	
	'** Now notice that field1$(1) no longer points to the same storage as  **
	'** its counterpart, field2$(1), as verified below.                     **
	
	LSET field1$(1) = "ABC"
	PRINT field1$(1); field2$(1)
	LSET field2$(1) = "GHI"
	PRINT field1$(1); field2$(1)
	CLOSE
	END
	
	FUNCTION Nothing (any$)
	        x$ = any$       '** so won't affect value of any$ **
	        PRINT x$
	END FUNCTION
