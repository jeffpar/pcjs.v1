---
layout: page
title: "Q34981: &quot;Expected End of Statement,&quot; Line Label with Leading Numeric"
permalink: /pubs/pc/reference/microsoft/kb/Q34981/
---

## Q34981: &quot;Expected End of Statement,&quot; Line Label with Leading Numeric

	Article: Q34981
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-DEC-1989
	
	QuickBASIC Versions 4.00, 4.00b and 4.50 do not allow a leading
	numeric character in a line label. QuickBASIC assumes that any line
	label starting with a number to be a line number followed by an
	executable statement. If such a line label is entered within the
	QuickBASIC Version 4.00 or 4.00b editing environment, an "Expected
	End of Statement" error message is displayed. For a detailed
	explanation, refer to Page 9 of the "Microsoft QuickBASIC Compiler
	4.0: BASIC Language Reference" manual.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	QuickBASIC Version 3.00 does allow leading numbers in a line label. To
	convert a QuickBASIC Version 3.00 program to QuickBASIC Version 4.00,
	4.00b or 4.50, select the Change option in the Search menu to replace
	all occurrences of the improper label with a valid line label or line
	number.
	
	The following program generates an "Expected End of Statement" error:
	
	PRINT "hello"
	GOTO 2line
	2line:
	        PRINT "goodbye"
