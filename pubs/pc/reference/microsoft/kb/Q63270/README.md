---
layout: page
title: "Q63270: QB &amp; QBX Insert Default REM &#36;STATIC Before a SUB or FUNCTION"
permalink: /pubs/pc/reference/microsoft/kb/Q63270/
---

## Q63270: QB &amp; QBX Insert Default REM &#36;STATIC Before a SUB or FUNCTION

	Article: Q63270
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900612-76 B_BasicCom
	Last Modified: 10-JAN-1991
	
	The QB.EXE and QBX.EXE editors automatically insert an invisible REM
	$STATIC metacommand before the first SUB or FUNCTION procedure if you
	have a REM $DYNAMIC in effect in a module-level (main program level)
	window. This REM $STATIC is visible only when the file is saved as
	Text and then viewed in other text editors or TYPEd in MS-DOS. This
	automatic REM $STATIC actually does not affect arrays dimensioned
	inside the SUB or FUNCTION procedures, as explained further below.
	
	This information applies to the QB.EXE environment that comes with
	Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50 for MS-DOS, and to
	the QBX.EXE environment that comes with Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	Note that the STATIC clause on a SUB or FUNCTION statement retains the
	value of local variables between invocations of that procedure. No
	STATIC clause on the SUB or FUNCTION statement means local variables
	are not retained between invocations. Do not confuse the STATIC clause
	of a SUB or FUNCTION statement with the array types of "static" (or
	$STATIC) or "dynamic" (or $DYNAMIC). These are distinct concepts.
	
	A static (or $STATIC) array is dimensioned at compile time. A dynamic
	(or $DYNAMIC) array is dimensioned at run time.
	
	The STATIC clause of SUB or FUNCTION statements affects locally
	dimensioned arrays as follows:
	
	1. SUB or FUNCTION statements with no STATIC clause appended (such as
	   "SUB x") force all locally dimensioned arrays to be dynamic, and
	   the REM $STATIC metacommand (if any) is ignored.
	
	2. SUB or FUNCTION statements with a STATIC clause (such as "SUB x
	   STATIC") allow locally dimensioned arrays to be dimensioned
	   dynamically or statically. For example, a REM $DYNAMIC metacommand
	   makes locally dimensioned arrays dynamic in a STATIC SUB. Without
	   using a metacommand, the locally dimensioned arrays will be static
	   (unless dimensioned with a variable in the subscript).
	
	Example 1
	---------
	
	If you type the following code example into QB or QBX, save the file
	as text, and use the TYPE command to display the file in DOS, you will
	see that QB or QBX inserted a REM $STATIC just before the "SUB sub1"
	line. This is by design, and doesn't affect any arrays.
	
	   REM $DYNAMIC
	   CALL sub1
	   END
	   SUB sub1
	     PRINT "hello"
	   END SUB
	
	Example 2
	---------
	
	When QB or QBX automatically places the REM $STATIC before a SUB or
	FUNCTION, the REM $STATIC actually does not affect that SUB or
	FUNCTION.
	
	In the case of a non-STATIC SUB, all locally dimensioned arrays are
	always $DYNAMIC. For example:
	
	   CALL sub1
	   END
	
	   REM $STATIC
	   SUB sub1
	     REM $STATIC ' QB and QBX ignore this.
	     DIM array1(1000)
	   END SUB
	
	In the code above, array1() is a $DYNAMIC array. This is because all
	arrays in non-STATIC SUBs and FUNCTIONs are required to be $DYNAMIC.
	The REM $STATIC metacommand does not affect arrays in non-STATIC SUBs.
	QB.EXE, QBX.EXE, and BC.EXE ignore both of the REM $STATIC
	metacommands in the above example.
	
	The only way to make any array static in a SUB or FUNCTION is to place
	the STATIC clause on the SUB or FUNCTION statement, as in the following
	example, where "array1" is static and "array2" is dynamic:
	
	   CALL sub1
	   END
	
	   SUB sub1 STATIC
	     DIM array1(1000)   ' Array defaults to a static array.
	     z=20
	     DIM array2(z)   ' A variable in the subscript makes array dynamic.
	   END SUB
	
	From these examples, you can see that the REM $STATIC that QB or QBX
	automatically inserts before the first SUB or FUNCTION can be ignored.
	It won't affect the arrays dimensioned in the SUB or FUNCTION. You do
	not need to compensate for it or program around it.
