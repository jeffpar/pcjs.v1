---
layout: page
title: "Q42853: Logically Same DOUBLE Precision Assignments, Different Results"
permalink: /pubs/pc/reference/microsoft/kb/Q42853/
---

## Q42853: Logically Same DOUBLE Precision Assignments, Different Results

	Article: Q42853
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-DEC-1989
	
	Assigning SINGLE or DOUBLE precision variables to logically equivalent
	expressions that use functions and temporary variables differently may
	return values that vary slightly at the limits of their precision.
	These variations can range above or below the expected integral value,
	and can thus affect results returned from the INT function. This is
	not a software problem, but is due to the way that the compiler
	optimizes different expressions and rounds off values at the limits of
	precision differently in different expressions. The binary math used
	by the compiler cannot precisely represent all floating-point values
	at each intermediate step in a calculation, and round-off errors are
	unavoidable. For more information, query on the word IEEETUTR.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00. This occurs both in the QuickBASIC
	environment (or the QuickBASIC Extended environment of BASIC PDS 7.00)
	and in executable programs compiled with BC.EXE.
	
	The following program demonstrates the behavior. The variable "A#" is
	assigned to three different expressions that are logically equivalent
	but yield different floating-point results that vary at the limits of
	double precision. These slight variations affect the results returned
	by the INT function if the floating-point value is slightly less than
	the "expected" integral value.
	
	CLS
	Log10# = LOG(10#)
	FOR I% = 1 TO 3
	   X# = 1#
	   SELECT CASE I%
	     CASE 1
	       PRINT "A# = LOG(X#) / LOG(10#)"
	     CASE 2
	       PRINT "A# = LOG(X#) / Log10#"
	     CASE 3
	       PRINT "A# = logX# / Log10#"
	     CASE ELSE
	   END SELECT
	   DO
	     X# = X# * 10#
	     logX# = LOG(X#)
	     ' The following three assignment statements are all logically
	     ' identical but all produce slightly different results for
	     ' different values of X#.
	     ' Values of X# used: 10, 100, 1000, 10000
	     SELECT CASE I%
	       CASE 1
	         A# = LOG(X#) / LOG(10#)
	       CASE 2
	         A# = LOG(X#) / Log10#
	       CASE 3
	         A# = logX# / Log10#
	       CASE ELSE
	     END SELECT
	     IntegPart# = INT(A#)
	     FractPart# = A# - INT(A#)
	     PRINT "A# = "; A#; TAB(27); "INT(A#) = "; IntegPart#;
	     PRINT TAB(43); "A# - INT(A#) = "; FractPart#
	   LOOP UNTIL X# > 1000#
	   PRINT
	NEXT I%
	END
	
	The program output is as follows:
	
	A# = LOG(X#) / LOG(10#)
	A# =  1                   INT(A#) =  1    A# - INT(A#) =  0
	A# =  2                   INT(A#) =  2    A# - INT(A#) =  0
	A# =  3                   INT(A#) =  3    A# - INT(A#) =  0
	A# =  4                   INT(A#) =  4    A# - INT(A#) =  0
	
	A# = LOG(X#) / Log10#
	A# =  .9999999999999999   INT(A#) =  0
	                          A# - INT(A#) =  .9999999999999999
	A# =  2                   INT(A#) =  1
	                          A# - INT(A#) =  .9999999999999998
	A# =  3                   INT(A#) =  2
	                          A# - INT(A#) =  .9999999999999996
	A# =  4                   INT(A#) =  3
	                          A# - INT(A#) =  .9999999999999996
	
	A# = logX# / Log10#
	A# =  1                   INT(A#) =  1    A# - INT(A#) =  0
	A# =  2                   INT(A#) =  2    A# - INT(A#) =  0
	A# =  3                   INT(A#) =  2    A# - INT(A#) =
	                                                   .9999999999999996
	A# =  4                   INT(A#) =  4    A# - INT(A#) =  0
