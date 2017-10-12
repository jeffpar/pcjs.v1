---
layout: page
title: "Q66213: \" Sequence Must Be Used to Define Strings with /D Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q66213/
---

	Article: Q66213
	Product: Microsoft C
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 24-OCT-1990
	
	The /D compiler switch is used to define a constant value to the
	preprocessor. It is equivalent to using a #define statement in the
	source code. The C version 6.00 "Microsoft C Reference" manual gives
	the syntax as follows:
	
	   /Did[=[value]]
	
	"Value" can be a number, character, or string constant such as "foo".
	In order to define a string constant, the '\"' escape sequence must be
	used. This requirement is undocumented. Please see the example shown
	below, where FOO is defined as "bar":
	
	   cl /DFOO=\"bar\" s.c
