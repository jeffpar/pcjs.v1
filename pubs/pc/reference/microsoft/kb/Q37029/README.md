---
layout: page
title: "Q37029: &quot;Invalid Constant&quot; Using Variable for Length of Fixed String"
permalink: /pubs/pc/reference/microsoft/kb/Q37029/
---

## Q37029: &quot;Invalid Constant&quot; Using Variable for Length of Fixed String

	Article: Q37029
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	The length of a fixed-length character string variable must be
	specified as a integer constant or as a CONST integer constant. The
	run-time error "Invalid Constant" results if the number in a "STRING *
	number" clause of a DIM or REDIM statement is a variable, or a
	constant of a non-integer type.
	
	The length of a fixed-length string must not be negative. A
	fixed-length string must have a length of at least one.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS
	and MS OS/2.
	
	QuickBASIC versions earlier than Version 4.00 do not support
	fixed-length string variables.
	
	The following is a code example:
	
	'This program will correctly give "Invalid Constant" when x is replaced
	'by y or z in the DIM statement.
	   DEFINT A-Z
	   CONST x = 11
	   CONST y = 11.0
	   z = 11
	   DIM a AS STRING * x
	   a = "hello there"
	   PRINT a
	   END
