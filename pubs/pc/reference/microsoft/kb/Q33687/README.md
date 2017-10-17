---
layout: page
title: "Q33687: Temporary Memory in SUBprogram Is Not Deallocated after CALL"
permalink: /pubs/pc/reference/microsoft/kb/Q33687/
---

## Q33687: Temporary Memory in SUBprogram Is Not Deallocated after CALL

	Article: Q33687
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 13-DEC-1989
	
	In EXE form, the following program uses 8K of memory, not 4K as it
	should. The program does not seem to deallocate the temporary memory
	after calling the dynamic subprogram. The program works correctly
	inside the QB.EXE editor. To duplicate the problem, the array needs to
	be dimensioned after the COMMON block (to make it dynamic) and 4K of
	data needs to be assigned inside the subprogram, as shown.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00,
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	To work around the problem, declare the array as static instead of as
	dynamic. You can make the array static by dimensioning it before the
	COMMON statement.
	
	Note: This problem does not occur in QuickBASIC Version 3.00.
	
	The following code example demonstrates this problem:
	
	   DECLARE SUB SaveWindow (WindowBuffer$)
	   COMMON tmp$()
	   DIM tmp$(10)
	   PRINT FRE(""), FRE(-1)
	   CALL SaveWindow(tmp$(5))
	   PRINT FRE(""), FRE(-1),
	   END
	   SUB SaveWindow (WindowBuffer$)
	     size% = 4000
	     WindowBuffer$ = STRING$(size%, CHR$(0))
	   END SUB
