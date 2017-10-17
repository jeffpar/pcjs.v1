---
layout: page
title: "Q66776: No Warning for Redeclared Parameter on Old-Style Declarations"
permalink: /pubs/pc/reference/microsoft/kb/Q66776/
---

## Q66776: No Warning for Redeclared Parameter on Old-Style Declarations

	Article: Q66776
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 10-NOV-1990
	
	In situations where the so-called "old-style" or "K&R-type" function
	declarations are used, the C compiler will not generate a warning when
	formal parameters are declared twice, even if they are redeclared with
	different types. This is expected behavior because one of the
	declarations is ignored when this type of function declaration is
	used. If ANSI-style, prototyped function declarations are used, a
	warning will be generated for any redeclarations.
	
	The following code sample demonstrates this redeclaration problem:
	
	   int func1(x, y)
	   int x;
	   long y;
	   float x;       /* x is redeclared here, but no warning is given */
	   {
	      return (int)(x + y);
	   }
	
	Even when this code is compiled at warning level 4 (/W4), the
	redeclaration of x does not generate any warnings -- the compiler only
	warns that func1() is using an old-style function declarator.
	
	Microsoft is committed to the ANSI standard and no diagnostic-message
	changes are planned to accommodate inconsistencies arising from use of
	the old declaration style. The ANSI specification, in section 3.9.5,
	page 96, states the following:
	
	   The use of function definitions with separate parameter identifier
	   and declaration lists (not prototype-format parameter type and
	   identifier declarators) is an obsolescent feature.
