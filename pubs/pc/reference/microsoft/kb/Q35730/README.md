---
layout: page
title: "Q35730: Incorrect Function Declaration"
permalink: /pubs/pc/reference/microsoft/kb/Q35730/
---

	Article: Q35730
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr h_fortran h_masm s_pascal
	Last Modified: 23-SEP-1988
	
	On Page 66 of the "Microsoft Mixed-Language Programmer's Guide"
	provided with C Versions 5.00 and 5.10, FORTRAN Versions 4.0x and
	4.10, MASM Versions 5.00 and 5.10, and Pascal Version 4.00, the
	example program given in section 5.4.2 "Calling C from Pascal --
	Function Call" is incorrect. If the Pascal source code in the manual
	is compiled, the following errors will occur on the function
	declaration line:
	
	                   function Fact (n : integer)  [C]; extern;
	                                              ^ ^          ^
	 Warning 173  Insert:     ____________________| |          |
	    (the compiler is expecting a colon)         |          |
	                                                |          |
	 315  Type unknown or invalid assumed integer __|          |
	      Begin Skip                                           |
	                                                           |
	 187  End Skip    _________________________________________|
	
	The function declaration in the Pascal program is missing its return
	value. If the line is corrected to look as follows the program works
	properly:
	
	function Fact (n : integer) : integer  [C]; extern;
