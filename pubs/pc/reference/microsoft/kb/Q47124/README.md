---
layout: page
title: "Q47124: Array in SUB Statement Doesn't Need Dimensions in Parentheses"
permalink: /pubs/pc/reference/microsoft/kb/Q47124/
---

## Q47124: Array in SUB Statement Doesn't Need Dimensions in Parentheses

	Article: Q47124
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 30-MAY-1990
	
	In QuickBASIC versions 3.00 and earlier, passing an array in a SUB
	statement requires the number of array dimensions to be specified in
	parentheses, such as x(2) for an array dimensioned as DIM x(10,10).
	Empty parentheses () after the array name in a SUB statement cause a
	compile-time error in QuickBASIC 3.00 and earlier.
	
	However, in QuickBASIC versions 4.00 and later, empty parentheses
	after the array name in a SUB statement are actually the preferred
	syntax. They are also the preferred syntax in Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2 and in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS and MS
	OS /2.
	
	In fact, the QB.EXE editor in QuickBASIC versions 4.00, 4.00b, and
	4.50 and the QBX.EXE editor in BASIC PDS version 7.00 automatically
	strip out the constant (if any) in the parentheses net to the array
	name in a SUB statement.
	
	When using a text editor (word processor, EDLIN, etc.) and writing the
	program using the syntax for QuickBASIC versions 3.00 or earlier, you
	will get an "L1101 Invalid Object Module" error when trying to link
	the .OBJ that was created using QuickBASIC versions 4.00 or later.
	
	The subroutine example for the LBOUND and UBOUND functions in the
	manuals doesn't require the subscript (2) in the array in the SUB
	statement. This applies to Page 60 of the "Microsoft QuickBASIC 4.0:
	Programming in BASIC: Selected Topics" manual for QuickBASIC versions
	4.00 and 4.00b and for Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Page 53 of the "Microsoft
	QuickBASIC 4.5: Programming in BASIC" manual for QuickBASIC version
	4.50. This misleading documentation was changed in Microsoft BASIC PDS
	version 7.00.
	
	The first line of the subroutine example shows the following, which is
	allowed but may be a little misleading, since QB.EXE and QBX.EXE strip
	out the "2":
	
	   SUB PrintOut(A(2)) STATIC
	
	No number of dimensions (2) is required for the A array. This line
	converts to the following preferred syntax when entered in the QB.EXE
	and QBX.EXE editor:
	
	   SUB PrintOut(A()) STATIC
