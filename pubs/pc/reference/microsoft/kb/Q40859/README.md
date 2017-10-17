---
layout: page
title: "Q40859: Cannot Use FN at Beginning of SUB or Variable Names"
permalink: /pubs/pc/reference/microsoft/kb/Q40859/
---

## Q40859: Cannot Use FN at Beginning of SUB or Variable Names

	Article: Q40859
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890124-96 B_BasicCom
	Last Modified: 15-DEC-1989
	
	In Microsoft QuickBASIC, the FN character combination is reserved for
	user-defined functions created with the DEF FN statement. Variable
	names, SUBprogram procedure names, and function procedure names
	defined with the FUNCTION statement may NOT use FN as the first
	characters in the name.
	
	Depending on usage, QuickBASIC can give you errors such as the
	following when you incorrectly use FN in a name:
	
	   Duplicate definition
	   Invalid identifier
	   Cannot start with FN
	   Function not defined
	
	The variable, SUBprogram, or FUNCTION should be renamed so that it
	does not start with the FN character combination.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	More information on the DEF FN statement can be found in the Microsoft
	BASIC language reference manual for your version of BASIC or
	QuickBASIC.
