---
layout: page
title: "Q40189: SADD Function Will Not Accept Concatenated or Quoted Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q40189/
---

## Q40189: SADD Function Will Not Accept Concatenated or Quoted Strings

	Article: Q40189
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890103-51
	Last Modified: 14-DEC-1989
	
	The SADD (String ADDress) function will not accept a concatenation of
	strings or a quoted literal string as a parameter. The only valid
	argument for the SADD function is a single, variable-length string
	variable.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Under versions of QuickBASIC earlier than Version 4.00, the SADD
	function accepts an argument that is a quoted literal string or a
	concatenation of strings. This behavior returns the address of the
	temporary storage location for the string. This is no longer allowed
	in QuickBASIC Version 4.00 or later.
	
	The following is a code example:
	
	c$ = "This program compiles and runs"
	b$ = " under Microsoft QuickBASIC 3.00"
	PRINT c$ + b$
	PRINT SADD(c$ + b$)
