---
layout: page
title: "Q65504: BASIC &quot;Statements/Labels Illegal Between SELECT CASE and CASE&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q65504/
---

## Q65504: BASIC &quot;Statements/Labels Illegal Between SELECT CASE and CASE&quot;

	Article: Q65504
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-SEP-1990
	
	Line numbers are allowed in most BASIC source statements. One area
	line numbers are not allowed in is an area of BASIC's SELECT CASE
	statement. If a line number precedes the first CASE ExpressionList
	part of the statement, the error "Statements/labels illegal between
	SELECT CASE and CASE" will be returned.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2; and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	The first versions of BASIC (interpreter) required line numbers for
	every line. For upward compatibility, this feature is still available
	in the newer BASICs. Some statements that are new to the language,
	however, restrict the use of the line number feature. One such
	statement is the SELECT CASE statement. Line numbers are allowed
	anywhere in the statement except between the SELECT CASE
	TextExpression and the first CASE ExpressionList.
	
	This limitation can be inconvenient to a programmer who wants to use
	line numbers in each line so that the ERL function can report the line
	on which an error occurred. However, with syntax checking turned on in
	QB.EXE or QBX.EXE, it is very unlikely an error will exist.
	
	The code example below demonstrates this discussion.
	
	Code Example
	------------
	
	CLS
	INPUT "Enter acceptable number (1-10): ", num
	'   Line numbers are OK to use on the SELECT statement:
	10     SELECT CASE num
	' The following statement generates the error "Statements/labels
	' illegal between SELECT CASE and CASE":
	15      CASE IS = 10
	' Removing the "15" eliminates the error.
	'   It is OK to put line numbers inside of the rest of the CASE:
	20         PRINT "Maximum number"
	        CASE 6 TO 9
	           PRINT "Higher, but not the maximum"
	        CASE 2 TO 5
	           PRINT "Moderate picker, aren't you"
	        CASE 1
	           PRINT "A low number indeed"
	        CASE ELSE
	           PRINT "RESPONSE OUT OF RANGE"
	     END SELECT
