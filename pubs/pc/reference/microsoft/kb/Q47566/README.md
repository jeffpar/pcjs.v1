---
layout: page
title: "Q47566: SHARED Dynamic Array Element Passed as Parameter Aliases to 0"
permalink: /pubs/pc/reference/microsoft/kb/Q47566/
---

## Q47566: SHARED Dynamic Array Element Passed as Parameter Aliases to 0

	Article: Q47566
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-NOV-1990
	
	If you attempt to alter an element of a SHARED or COMMON SHARED
	$DYNAMIC array while inside a SUBprogram and that element has also
	been passed as a parameter to the SUBprogram, the value returned in
	the parameter will be the value assigned to the array element upon
	exit from the SUBprogram, and will replace whatever value may have
	been assigned directly to the array in the SUBprogram.
	
	This behavior occurs in Microsoft QuickBASIC versions 4.00, 4.00b, and
	4.50, Microsoft BASIC Compiler 6.00 and 6.00b for MS-DOS and MS OS/2,
	and Microsoft BASIC PDS 7.00 for MS-DOS and MS OS/2.
	
	This is a form of variable aliasing, which is a programming practice
	not recommended by Microsoft. A variable passed in an argument list to
	a procedure should not also be shared by means of the SHARED statement
	or the SHARED attribute (of the DIM or COMMON statement) in that
	procedure's module.
	
	Similarly, a variable should not be passed twice in the list of
	arguments passed to a procedure, or else variable aliasing problems
	occur. This information can be found under "The Problem of Variable
	Aliasing" section, on Page 64 in the "Microsoft BASIC 7.0:
	Programmer's Guide" for BASIC PDS versions 7.00 and 7.10, on Page 68
	of the "Microsoft QuickBASIC 4.5: Programming in BASIC" manual, and on
	Page 78 of "Microsoft QuickBASIC 4.0: Programming in BASIC: Selected
	Topics" manual for versions 4.00 and 4.00b.
	
	The behavior in the first example above results from the way
	QuickBASIC accesses $DYNAMIC arrays. Since access to these arrays
	requires a far pointer, and all parameters use near pointers, a
	temporary location is set aside for the parameter before and during
	the CALL, and the value in this location is assigned to the actual
	array element following the return from the CALL. Thus, whatever value
	you assign to the array element inside the SUBprogram using the SHARED
	array name will be replaced with the value of the parameter when the
	SUBprogram ends.
	
	Note that when inside the QuickBASIC environment, virtually all arrays
	are treated as $DYNAMIC. It is only at compile time that $STATIC
	arrays are actually made $STATIC by allocation in the data segment.
	Since the QuickBASIC editor treats most arrays as $DYNAMIC, this
	behavior can be observed in the editor even for arrays declared
	$STATIC. Please see Pages 32-33 in the "Microsoft QuickBASIC 4.0:
	BASIC Language Reference" manual for versions 4.00 and 4.00b, and
	Pages 719-721 in the "Microsoft BASIC 7.0: Programmer's Guide" for
	BASIC PDS Version 7.00, for a complete description of where arrays are
	stored.
	
	The following example demonstrates this behavior:
	
	DECLARE SUB test (a!)
	CLS
	' *** The DYNAMIC metacommand is not required to reproduce
	'     this behavior inside the QuickBASIC environment.
	'$DYNAMIC
	DIM SHARED b(20)        'Step 1. b(20) initially is 0.
	CALL test(b(20))
	PRINT b(20)             'Step 3. PRINTs 0 -- global has been
	END                     '        replaced by returned value.
	
	SUB test (a!)
	  b(20) = 10
	  PRINT b(20)           'Step 2. PRINTs 10 -- Global value is
	END SUB                 '        changed. Parameter a! is still 0.
