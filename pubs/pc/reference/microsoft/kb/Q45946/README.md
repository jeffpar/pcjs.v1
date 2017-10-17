---
layout: page
title: "Q45946: Unresolved Externals Using OS/2 Functions and INCL_NOCOMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q45946/
---

## Q45946: Unresolved Externals Using OS/2 Functions and INCL_NOCOMMON

	Article: Q45946
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1989
	
	If you are using OS/2 functions and getting "unresolved external"
	messages at link time even though OS2.H is included, check for a
	definition of the manifest constant INCL_NOCOMMON. The definition of
	this constant excludes any function group that is not explicitly
	included by the definition of another manifest constant.
	
	For example, to include the OS/2 system functions (DOS) and exclude
	all others, the following two statements must exist in the source
	code:
	
	   #define INCL_NOCOMMON
	   #define INCL_DOS
	
	Look closely at the "unresolved external" message. If the compiler has
	prepended an underscore to the function name, then the prototype is
	not being included. All OS/2 functions are defined with a PASCAL
	calling sequence. Therefore, there should never be an underscore
	prepended to the function name.
	
	As a quick test, remove the INCL_NOCOMMON statement from the code and
	recompile. If the program compiles and links without the INCL_NOCOMMON
	statement, then you have only to determine which manifest constant
	correctly includes the function group that includes the function in
	question.
	
	As an alternative, compiling at warning level three generates a "no
	prototype given" warning for the function if the function prototype is
	being excluded by the INCL_NOCOMMON statement. If this is the case,
	determine which manifest constant will include the function prototype,
	and define it along with the INCL_NOCOMMON statement.
	
	A comprehensive listing of these manifest constants can be found in
	the "Microsoft OS/2 Programmer's Reference," Volume #1, Pages 41-44.
