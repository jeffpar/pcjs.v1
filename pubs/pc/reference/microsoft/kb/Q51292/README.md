---
layout: page
title: "Q51292: PRINT SPC(n) USING on Array Element, Bad Results"
permalink: /pubs/pc/reference/microsoft/kb/Q51292/
---

## Q51292: PRINT SPC(n) USING on Array Element, Bad Results

	Article: Q51292
	Version(s): 4.00 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891110-96 buglist4.00 buglist4.50 fixlist4.00b
	Last Modified: 13-DEC-1989
	
	The following code example demonstrates that using the SPC(n) function
	with the PRINT USING statement on an element of an array ($DYNAMIC or
	$STATIC) produces incorrect results with BC.EXE compiler Versions 4.00
	and 4.50. This problem does not occur in BC.EXE provided with
	QuickBASIC 4.00b or with the BASIC compiler 6.00 or 6.00b. This
	problem does not occur in the QB.EXE 4.00, 4.00b, and 4.50 editors.
	This problem does not occur in BC.EXE or QBX.EXE provided with
	Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	The code example produces incorrect output when compiled with BC.EXE
	Version 4.50. Compiled with BC.EXE Version 4.00, it produces the error
	"Type mismatch in line 40 of module <filename> at address xxxx:xxxx".
	
	This problem occurs with either dynamic or static arrays. Compiling
	with the /AH switch does NOT correct the problem in either Version
	4.00 or 4.50.
	
	There are several workarounds to this problem. The easiest workaround
	is to use a literal such as " " or to use a function such as
	STRING(n, " "), which produces the same results as using the SPC(n)
	function. For example,
	
	    PRINT ; STRING$(1, " ") ; USING ........
	
	is the equivalent of
	
	    PRINT ; SPC(1) ; USING .......
	
	The above workaround will work in Version 4.00 or 4.50. However, in
	Version 4.50 the problem also does not occur if you compile with
	either the /d or /x options as follows:
	
	1. In the QB.EXE editor, choose to "Produce Debug Code".
	
	2. On the BC.EXE compile line use /D.
	
	The problem also does not occur if you use error trapping. This is
	done by including an ON ERROR GOTO and RESUME in the program. On the
	BC.EXE command line, include the /X compiler option. No combination of
	compiler switches corrects the problem for Version 4.00.
	
	Code Example
	------------
	
	' This code example can be used to reproduce the problem.
	' Do not include error trapping or produce debug code.
	REM $DYNAMIC
	CLS
	DEFINT A-Z
	TYPE Rec1
	       F1 AS STRING * 15
	       F2 AS INTEGER
	       F3 AS INTEGER
	       F4 AS INTEGER
	       F5 AS INTEGER
	       F6 AS INTEGER
	       F7 AS INTEGER
	       F8 AS INTEGER
	END TYPE
	DIM a1(2) AS Rec1
	FOR k = 1 TO 2
	       READ a1(k).F1
	       READ a1(k).F2
	       READ a1(k).F3
	       READ a1(k).F4
	       READ a1(k).F5
	       READ a1(k).F6
	       READ a1(k).F8
	       a1(k).F7 = a1(k).F5 - a1(k).F6
	NEXT k
	Col = 12
	LOCATE , Col
	PRINT "  PGM=M1   A           B   C   D   E    F     G    H    J"
	LOCATE , Col
	PRINT STRING$(60, 196)
	10 FOR k = 1 TO 2
	20     LOCATE , Col
	30     PRINT SPC(1); USING "###"; k;
	40     PRINT ".";
	50     PRINT ; a1(k).F1;
	60     PRINT ; SPC(1); USING "###"; a1(k).F2 + a1(k).F3 + a1(k).F4;
	70     PRINT ; SPC(1); USING "###"; a1(k).F2;
	80
	'********************************************************************
	90      PRINT ; SPC(1); USING "###"; a1(k).F3; ' Error occurs here.
	100     PRINT ; SPC(1); USING "###"; a1(k).F4; ' Error occurs here.
	110
	120
	'********************************************************************
	130     PRINT ; SPC(1); USING "####"; a1(k).F5;
	140     PRINT " :";
	150      PRINT ; SPC(1); USING "###"; a1(k).F6;
	160     PRINT ; SPC(1); USING "####"; a1(k).F7;
	170     PRINT ; SPC(1); USING "####"; a1(k).F8
	180 NEXT k
	190 END
	
	DATA "Club 01   ",  2, 0, 9, 33, 57,  4
	DATA "Club 02   ",  3, 2, 6, 45, 17,  4
	END
