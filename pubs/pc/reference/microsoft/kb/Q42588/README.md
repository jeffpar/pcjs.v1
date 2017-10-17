---
layout: page
title: "Q42588: &quot;Variable Required&quot; Versus &quot;Duplicate Definition&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q42588/
---

## Q42588: &quot;Variable Required&quot; Versus &quot;Duplicate Definition&quot; Error

	Article: Q42588
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890227-97 B_BasicCom
	Last Modified: 16-DEC-1989
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50
	for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	When a program attempts to define a variable and a function to have
	the same name, an error occurs. Normally, this error is "DUPLICATE
	DEFINITION." However, if the variable is first used in a FOR...NEXT
	statement, then the error message issued from QB.EXE (or QBX.EXE under
	the BASIC PDS 7.00) is "Variable Required", but from BC.EXE the two
	error messages "Variable Required" and "NEXT WITHOUT FOR" are
	generated.
	
	The following Code will generate a "Variable Required" error in
	QB.EXE / QBX.EXE:
	
	DECLARE FUNCTION bit% ()
	
	FOR bit% = 0 TO 7
	NEXT
	
	FUNCTION bit%
	  bit% = 5
	END FUNCTION
	
	Under QuickBASIC 4.50, pressing the HELP button for the "Variable
	Required" error box misleadingly gives the following run-time error
	explanation instead of the compile-time explanation:
	
	   "A GET or PUT statement must specify a variable when operating
	    on a file opened in binary mode. ERR code: #40.
	
	The compile-time meaning of "Variable Required" explained in the
	"Microsoft QuickBASIC: Programming in BASIC" manual for Version 4.50
	is more accurate.
