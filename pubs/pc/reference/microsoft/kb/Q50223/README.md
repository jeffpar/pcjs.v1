---
layout: page
title: "Q50223: Printing Double Quotation Marks from within an M Editor Macro"
permalink: /pubs/pc/reference/microsoft/kb/Q50223/
---

## Q50223: Printing Double Quotation Marks from within an M Editor Macro

	Article: Q50223
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	To get double quotation marks ("") printed from within a macro in the
	M Editor, use the backslash key (\) followed by the double quotation
	marks (""). The following example (placed in the correct section of
	the TOOLS.INI file) demonstrates how this is done:
	
	   text:=arg "say \"hello\"" paste
	   text:alt+z
	
	In this case, pressing ALT+Z inserts the following string into your
	text, with the double quotation marks around the word hello.
	
	   say "hello"
