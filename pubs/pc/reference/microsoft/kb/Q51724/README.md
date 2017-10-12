---
layout: page
title: "Q51724: Clarification of the /H Identifier Length Option"
permalink: /pubs/pc/reference/microsoft/kb/Q51724/
---

	Article: Q51724
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC docerr
	Last Modified: 15-MAR-1990
	
	The /H option is used to set the maximum length of identifiers in
	Microsoft C Version 5.10. Using /H can only decrease the maximum
	allowable length of identifiers, not increase it. An identifier
	declared with the CDECL type has an underscore (_) appended to the
	front at compile time. This character is part of the identifier and
	takes a significant location. Therefore, the maximum length of an
	identifier declared with the standard C declaration syntax is 32
	characters (the compiler limit on Page 280 of the "Microsoft C User's
	Guide" for Version 5.10 specifies 31 characters, which does not
	include the underscore).
	
	The following example shows how using /H can actually introduce errors
	if identifier lengths are limited to much:
	
	/* When compiled with /H5, the following code will produce
	the error 'L2025: _func : symbol defined more than once'. */
	
	void func1(void);
	void func2(void);
	
	void main(void)
	{
	     func1();
	}
	
	void func1(void)
	{
	}
	
	void func2(void)
	{
	}
	
	You must also be careful when using the /H option because of
	predefined compiler identifiers. If the maximum identifier length is
	too small, certain predefined identifiers will be unresolved as well
	as certain library function calls. For example, if the printf function
	is used and the option /H5 is specified at compile time, the symbol
	_prin will be created in order to reference printf, and this will not
	be found in the library.
