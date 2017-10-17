---
layout: page
title: "Q44465: L2025 LINK Error May Be Caused by Conflicting Library Routines"
permalink: /pubs/pc/reference/microsoft/kb/Q44465/
---

## Q44465: L2025 LINK Error May Be Caused by Conflicting Library Routines

	Article: Q44465
	Version(s): 3.x 4.06 4.07 5.0x 5.10 5.13 | 5.01.21 5.02 5.03 5.10 5.1
	Operating System: MS-DOS                       | OS/2
	Flags: ENDUSER | s_lib
	Last Modified: 24-JAN-1991
	
	All variables and routines in a module within a library will be linked
	into a program when any single variable or routine residing in that
	module is referenced. This can cause the following linker error if two
	or more modules contain definitions for the same symbol:
	
	   L2025  symbol defined more than once
	
	For example, in the diagram below, module1 contains routines "a", "b",
	and "c". The module2 contains routines "c", "d", and "e". When main()
	references "a" and "e", the linker links module1 and module2 from the
	library. This results in "c" being defined twice. Removing "c" from
	one of the modules, recompiling the module, and replacing the module
	in the library with the LIB utility operator "-+" will prevent "c"
	from being multiply defined.
	
	                        +-----------+
	                        |           |
	                        | calls "a" |
	                        | calls "e" |
	                      / |           | \
	                     /  +-----------+  \
	                    /       main()      \
	                   v                     v
	               +-------+             +-------+
	               |   a   |             |   c   |
	               |   b   |             |   d   |
	               |   c   |             |   e   |
	               |       |             |       |
	               +-------+             +-------+
	                module1               module2
	
	For each routine you want to be linked separately, compile a separate
	object file and add it to the library.
	
	
	
	
	
	
	Microsoft `M' Editor
	=============================================================================
