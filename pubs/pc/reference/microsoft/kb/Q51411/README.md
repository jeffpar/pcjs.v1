---
layout: page
title: "Q51411: How to Use SEG Keyword with Arrays in DECLARE and CALLs"
permalink: /pubs/pc/reference/microsoft/kb/Q51411/
---

## Q51411: How to Use SEG Keyword with Arrays in DECLARE and CALLs

	Article: Q51411
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891120-129 B_BASICCOM
	Last Modified: 12-DEC-1989
	
	The examples shown below demonstrate how to use the SEG keyword with
	arrays. The SEG keyword may be used in either a DECLARE statement or a
	CALL statement when calling a non-BASIC routine, and is used to pass
	both the segment and offset of a variable (which corresponds to
	passing a far address).
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS and to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2.
	
	When using SEG in the DECLARE statement to pass the far address of an
	array to a non-BASIC routine, the array should be specified as a
	simple variable without using the array notation, as follows:
	
	   DECLARE SUB TEST(SEG a AS INTEGER)
	   DIM a(10) AS INTEGER
	   TEST(a(0))
	
	A compilation error will occur if the array is DECLAREd using array
	notation as follows:
	
	   DECLARE SUB TEST(SEG a() AS INTEGER)
	   DIM a(10) AS INTEGER
	   TEST(a(0))
	
	Inside the QuickBASIC QB.EXE environment, the error message "Expected:
	, or )" will be displayed for the above DECLARE statement. When
	compiled from the BC.EXE command line, the following two error
	messages display:
	
	   "Syntax error"
	   "Formal parameter specification illegal"
	
	When using SEG in an explicit CALL statement there should not be a
	DECLARE statement. Explicitly using the CALL keyword (instead of using
	an implied call) takes the place of the DECLARE statement. The correct
	syntax is as follows:
	
	   DIM a(10) AS INTEGER
	   CALL TEST(SEG a(0))
	
	If a DECLARE statement is used with an explicit CALL statement that
	uses SEG, the error "Parameter type mismatch" displays.
