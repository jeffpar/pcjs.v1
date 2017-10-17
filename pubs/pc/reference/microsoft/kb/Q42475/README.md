---
layout: page
title: "Q42475: BASIC Uses ALIAS to DECLARE C Routines with Underscore in Name"
permalink: /pubs/pc/reference/microsoft/kb/Q42475/
---

## Q42475: BASIC Uses ALIAS to DECLARE C Routines with Underscore in Name

	Article: Q42475
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 30-MAY-1990
	
	To call a Microsoft C routine from QuickBASIC, the C routine must
	first be declared using a DECLARE statement. If the C routine name
	contains an embedded underscore, which is improper syntax in
	QuickBASIC, you must use the ALIAS clause to give it a valid BASIC
	name.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler versions 6.00 and 6.00b, and
	Microsoft BASIC Professional Development System (PDS) version 7.00.
	The references to DECLARE, ALIAS, and CDECL can be found on Pages 142
	to 146 of the "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	manual.
	
	C functions added to a library or Quick library have an underscore
	added to the front of the function name (that is, "foo_bar" will
	become "_foo_bar" in a library). When you DECLARE a C routine in a
	BASIC program, you must use the CDECL clause, which automatically
	adjusts for the underscore at the front of the routine name.
	
	However, if you want to use the ALIAS clause to DECLARE a C function
	that has an embedded underscore (for example, "foo_bar"), the CDECL
	clause will not add the underscore automatically to the front of the
	ALIAS name.
	
	The following is an example:
	
	REM *** BASIC program to call foo_bar ***
	DECLARE SUB foobar CDECL ALIAS "_foo_bar"
	CALL foobar
	END
	
	/* C function with embedded underscore */
	void foo_bar()
	{
	  putch('A');
	}
