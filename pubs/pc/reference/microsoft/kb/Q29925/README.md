---
layout: page
title: "Q29925: Wild-Card Expansion"
permalink: /pubs/pc/reference/microsoft/kb/Q29925/
---

## Q29925: Wild-Card Expansion

	Article: Q29925
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	Problem:
	
	I am attempting to insert the _setargv module into my standard C
	library to expand wild-card command line arguments as documented on
	Page 130 of the "Microsoft C 5.10 Optimizing Compiler User's Guide."
	
	When I invoke the LIB utility to remove the old _setargv module
	from the C library, I get the warning message "setargv.obj: warning
	U4151: '__setargv': symbol defined in module stdargv, redefinition
	ignored."
	
	My program is supposed to expand *.dat and print the names of all .dat
	files in the current directory. When I link my compiled code to the
	modified C library, I do not receive any errors. However, when I run
	my program, it prints out *.dat instead of expanding the wild card.
	
	Response:
	
	This is an error in documentation. The name of the module that you
	should extract from the C run-time library is stdargv. To replace this
	module with the module for expanding wild cards, use the LIB utility
	and enter the following module names after the Operations: prompt:
	
	Operations: -stdargv+setargv
	
	After performing this operation with LIB, linking the modified C
	library to your code will now permit the expansion of wild-card
	arguments by means of the argv[] array that is one of the main()
	function arguments.
	
	Note that you may link the object file setargv.obj with your code and
	an unmodified C run-time library to allow the expansion of wild cards.
	The replacement of module stdargv with setargv.obj allows wild-card
	expansion without explicitly linking in "setargv.obj" each time.
	
	C Version 4.00 and its documentation about the wild-card expansion
	library module had a similar problem.
	
	If you are using C Version 4.00, search for wild card and setargv for
	more information.
