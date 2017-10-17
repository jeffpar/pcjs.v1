---
layout: page
title: "Q33712: &quot;Subscript Out of Range&quot; DIM SHARED Dynamic Array in SUBmodule"
permalink: /pubs/pc/reference/microsoft/kb/Q33712/
---

## Q33712: &quot;Subscript Out of Range&quot; DIM SHARED Dynamic Array in SUBmodule

	Article: Q33712
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-FEB-1990
	
	A "Subscript out of range" message displays at run time when a dynamic
	array is dimensioned using REM $DYNAMIC and DIM SHARED statements at
	the module level of a support (nonmain) module (composed of just
	subprogram or FUNCTION procedures). In contrast, if the DIM SHARED
	array is a statically dimensioned array instead of a dynamically
	dimensioned array, the program runs without the error message. This
	difference between dynamic and static arrays is not a problem with
	QuickBASIC, but occurs because a DIM for a dynamic array is an
	executable statement (processed only if encountered in the flow of
	control at run time), whereas a DIM for a static array is a
	nonexecutable statement (always processed at compile time).
	
	This information applies to QuickBASIC Versions 4.00b and 4.50 for
	MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS and OS/2.
	
	A DIM for a dynamic array is only executed at run time if the
	program's control flows through that DIM statement. Since no
	executable statements are ever executed at the module-level of a
	support (nonmain) module, the DIM statements for dynamic arrays at the
	module level of a support module are ignored. "Subscript out of Range"
	displays for the first time an undimensioned array is referenced in
	the subprogram.
	
	In contrast, static arrays are allocated at compile time; and the DIM
	statement for a static array at the module-level of a support module
	is always recognized. A DIM statement for a static array is a
	compile-time, nonexecutable statement.
	
	When compiling to an EXE file, be sure to produce debug code (that is,
	compile with the /D switch) to catch array problems.
	
	To work around the compiler's ignoring of DIM SHARED for dynamic
	arrays at the module level of support modules, dimension the dynamic
	array in the main module (source file), and pass the array to the
	second module (separate source file) using the COMMON SHARED statement
	in both modules.
	
	The following code fails with a "Subscript out of range" error when an
	element of the array is assigned to a value:
	
	Module #1
	---------
	
	   DECLARE SUB test()
	   CALL test
	
	Module #2
	---------
	
	   REM $DYNAMIC            'will work if this is commented out
	   DIM SHARED a(10,30,30)
	   SUB test STATIC
	   a(1,1,1) = 4           'Subscript out of range error
	   PRINT a(1,1,1)
	   END SUB
	
	The following code successfully shares the dynamic array with the
	procedure in the support module:
	
	Module #1
	---------
	
	   DECLARE SUB test()
	   REM $DYNAMIC
	   COMMON SHARED a()
	   DIM a(10,30,30)
	   CALL test
	
	Module #2
	---------
	
	   COMMON SHARED A()
	   SUB test STATIC
	   a(1,1,1) = 4
	   PRINT a(1,1,1)
	   END SUB
