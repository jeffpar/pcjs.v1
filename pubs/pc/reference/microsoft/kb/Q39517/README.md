---
layout: page
title: "Q39517: Comparing String Arguments in Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q39517/
---

## Q39517: Comparing String Arguments in Macros

	Article: Q39517
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | eq if directive ifidn arguments
	Last Modified: 12-JAN-1989
	
	When using IF directives, relational operators could be used to form
	the conditions. Note: The relational operators treat the expressions
	as follows:
	
	   EQ and NE treat their operators as 16-bit numbers
	
	   LT, LE, GT, and GE treat their operators as 17-bit numbers.
	
	The relational operators cannot be used for comparing string
	arguments. It is often necessary to compare string arguments in
	MACROs. IFIDN and IFDIF directives are available for this purpose.
	IFIDN grants assembly if two arguments are identical; IFDIF grants
	assembly if two arguments are different. The syntax is as follows:
	
	    IFIDN <argument1>,<argument2>
	    IFDIF <argument1>,<argument2>
	
	Please refer to "Microsoft Macro Assembler Programmer's Guide" in the
	section "Assembling Conditionally" for more specific information.
