---
layout: page
title: "Q44004: Error L2025 from BASIC Calls to QuickC 2.00 Routines"
permalink: /pubs/pc/reference/microsoft/kb/Q44004/
---

	Article: Q44004
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_C B_QuickBAS
	Last Modified: 2-MAY-1989
	
	Calling C routines in object modules compiled with Microsoft QuickC
	Version 2.00 from BASIC routines works correctly only when the BASIC
	modules are compiled with QuickBASIC Version 4.50. Using earlier
	versions of QuickBASIC or the BASIC Compiler 6.00 or 6.00b results in
	the following linker error message:
	
	   L2025  'name' : symbol defined more than once
	
	Prior versions of QuickC can be linked successfully with the earlier
	versions of QuickBASIC or the BASIC Compiler 6.00 or 6.00b.
	
	In addition, when using graphics routines in C or BASIC mixed-language
	programs, the graphics calls must be from the QuickBASIC routines and
	use the QuickBASIC library. If graphics routines are called from
	QuickC 2.00, the linker returns the same error message as above. If
	the graphics routines are called from prior versions of the C run-time
	libraries, no error message is displayed; however, the results are
	unpredictable.
	
	If the QuickC 2.00 library includes the C Graphics or Pgchart library
	routines, then the QuickBASIC Version 4.50 calling program must be
	compiled without the /O option (using the BRUN45 library instead of
	BCOM45). Otherwise, you will get many "symbol defined more than once"
	errors at link time.
	
	Using the linker option /NOE (NO Extended function name/symbol
	dictionary search) will not prevent the L2025 error because the
	symbols are defined in both the QuickC 2.00 and BASIC libraries.
