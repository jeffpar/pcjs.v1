---
layout: page
title: "Q31557: Passing Array of TYPE or Fixed-Length Strings to SUBprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q31557/
---

## Q31557: Passing Array of TYPE or Fixed-Length Strings to SUBprogram

	Article: Q31557
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-JAN-1991
	
	An array of fixed-length strings cannot be passed directly as a
	parameter to a SUBprogram or FUNCTION procedure (that is, the phrase
	AS STRING*n cannot be used in DECLARE, SUB, or FUNCTION statements).
	
	The following are three alternatives for passing an array of
	fixed-length strings to a procedure:
	
	1. Pass the array of fixed-length strings through COMMON SHARED.
	   (Please see Example 1 below.)
	
	2. Convert the array of fixed-length strings to an array of
	   user-defined type and pass the array AS that type. (Please see
	   Example 2 below or the TORUS.BAS sample program provided on the
	   release disk.)
	
	3. Convert the array of fixed-length strings to an array of
	   user-defined type and pass that array through COMMON SHARED. (Please
	   see Example 3 below.)
	
	This information applies to QuickBASIC Versions 4.00, 4.00b and 4.50,
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	OS/2, and to Microsoft BASIC Professional Development System (PDS)
	Versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Note that when you pass a simple fixed-length string variable to a
	procedure, it is always converted to a variable-length string. Thus,
	the variable-length STRING type is allowed in DECLARE, SUB, and
	FUNCTION statements, but the fixed-length STRING*n type is not.
	
	The following is an example (Example 1) of how to pass an array of
	fixed-length strings through COMMON SHARED:
	
	   DECLARE SUB TEST()
	   DIM X(1 TO 30) AS STRING*22
	   COMMON SHARED X() AS STRING*22
	   X(5)="THIS IS A TEST"
	   CALL TEST
	   END
	   SUB TEST STATIC
	      PRINT X(5)
	   END SUB
	
	The following is an example (Example 2) of how to pass an array of
	user-defined type as a parameter to a procedure:
	
	   DECLARE SUB sub1 (t() AS ANY)
	   TYPE foo
	     y AS STRING * 10
	   END TYPE
	   DIM t(10) AS foo
	   CALL sub1(t())
	   PRINT t(1).y
	   END
	   SUB sub1 (t() AS foo)
	     t(1).y = "test"
	   END SUB
	
	The following is an example of how to pass an array of user-defined
	type through COMMON SHARED:
	
	   TYPE FOO
	     FIRST AS STRING*25
	   END TYPE
	   DIM AR(9) AS FOO
	   COMMON SHARED AR() AS FOO, TEMP AS INTEGER
	   AR(5).FIRST="This is fifth element"
	   TEMP=99
	   CALL TEST
	   END
	   SUB TEST STATIC
	     PRINT AR(5).FIRST
	     PRINT TEMP
	   END SUB
