---
layout: page
title: "Q35658: &quot;Array Already Dimensioned&quot; if 2nd DIM for Static Array in IF"
permalink: /pubs/pc/reference/microsoft/kb/Q35658/
---

## Q35658: &quot;Array Already Dimensioned&quot; if 2nd DIM for Static Array in IF

	Article: Q35658
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-DEC-1989
	
	Static arrays are dimensioned at compile time, regardless of whether
	or not the DIM statement is in the program flow of control. For
	example, if the DIM for a static array occurs in an IF statement that
	would never be executed at run time, the array will still be
	dimensioned at compile time. If you attempt to dimension a given
	static array more than once in a source file, you will get an "Array
	Already Dimensioned" error on the second DIM statement at compile
	time, as in the following example:
	
	10 x = 1
	20 IF x = 2 THEN DIM array(14)
	25 IF x = 1 THEN DIM array(25)  ' "Array Already Dimensioned" compile-time
	30 array(21) = 4
	40 PRINT array(21)
	
	This behavior occurs in all versions of Microsoft QuickBASIC for the
	IBM PC, in the Microsoft BASIC Compiler Versions 5.35 and 5.36 for
	MS-DOS and Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and in
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The QuickBASIC compiler allocates static arrays as they are
	encountered in one top-to-bottom pass through the source file at
	compile time. In contrast, dynamic arrays are dimensioned only when
	the flow of control reaches a DIM statement at run time.
	
	By default, arrays are static in the above compilers, unless you DIM
	them with a variable in the subscript. Adding the REM $DYNAMIC
	metacommand to the top of the program makes the arrays default to
	dynamic. Note that arrays are always dynamic in the Microsoft
	GW-BASIC, IBM BASICA, and Compaq BASICA Interpreters.
	
	The program below is another illustration. The compiled program will
	run without any error message, since the DIM for the static array is
	allocated at compile time. If you added a REM $DYNAMIC statement to
	make all arrays default to dynamic, the compiled program would give a
	"Subscript out of Range" error message at run time:
	
	10 x = 1
	20 IF x = 2 THEN DIM array(14)
	30 array(11) = 4
	40 PRINT array(11)
	
	The above program will give a "Subscript out of Range" error in the
	GW-BASIC Version 3.20 interpreter, since the DIM for the dynamic array
	in the IF statement is not executed at run time, and the array in line
	30 defaults to only ten elements.
