---
layout: page
title: "Q37481: PRINT USING Statement Fails to Use Print Zones"
permalink: /pubs/pc/reference/microsoft/kb/Q37481/
---

## Q37481: PRINT USING Statement Fails to Use Print Zones

	Article: Q37481
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 12-JAN-1990
	
	The PRINT USING statement is not designed to print the values of an
	expression list in the 14-character print zones. Instead, it ignores
	the comma and treats it like a semicolon. In QuickBASIC Version 4.50,
	the syntax checker correctly changes the comma to a semicolon.
	However, several manuals (listed below) and the online help system
	incorrectly state that the comma is syntactically legal.
	
	The incorrect syntax for the PRINT USING statement is as follows:
	
	   PRINT USING formatstring; expressionlist [{,|;}]
	
	The incorrect definition for the PRINT USING statement is as follows:
	
	   The position of each printed item is determined by the punctuation
	   used to separate the items in the list. BASIC divides the line into
	   print zones of 14 spaces each. In the expression list, a comma
	   makes the next value print at the start of the next zone. A
	   semicolon makes the next value print immediately after the last
	   value.
	
	This incorrect syntax or definition is given in each of the following
	references:
	
	1. Page 275 of the "Microsoft BASIC 7.0: BASIC Language Reference" for
	   Microsoft BASIC PDS Version 7.00
	
	2. Page 335 of the "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" for QuickBASIC 4.00 and 4.00b
	
	3. Page 287 of the "Microsoft QuickBASIC: BASIC Language Reference"
	   for QuickBASIC 4.50
	
	4. Page 335 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" for Microsoft BASIC Compiler Versions 6.00 and 6.00b
	
	5. The online help system for Microsoft QuickBASIC 4.50 under the
	   entry for PRINT USING statement
	
	6. The online help system for BASIC PDS 7.00 under the entry for the
	   PRINT USING statement
	
	The following is a code example that demonstrates that PRINT USING
	treats commas as if they were semicolons. When run in the environment,
	the code example will correctly substitute a semicolon between the
	variables "a" and "b" for the comma:
	
	   a=3.45
	   b=5.23
	   PRINT USING "##.##";a,b
	
	The output is as follows:
	
	   3.45 5.23
