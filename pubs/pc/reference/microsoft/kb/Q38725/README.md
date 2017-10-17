---
layout: page
title: "Q38725: Why Unitialized Global Variables Don't Appear in C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q38725/
---

## Q38725: Why Unitialized Global Variables Don't Appear in C 5.10

	Article: Q38725
	Version(s): 3.65
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881021-5044
	Last Modified: 6-DEC-1988
	
	Questions:
	
	Why don't uninitialized global variables show up in the library
	listing when the module containing them has been placed in the
	library? It appears that the librarian does not "see" uninitialized
	global variables.
	
	If my main program declares an extern, and an .OBJ with which its
	linked declares it globally (without extern), but doesn't initialize
	it, the symbol appears in the link map and space is allocated for it
	in the .EXE. This behavior seems different from previous versions of
	the compiler. If the .OBJ file is placed as a library rather than
	linked explicitly, the symbol does not appear in the .EXE. Why does it
	behave differently?
	
	Response:
	
	In Version 5.00 of the C Compiler, we introduced a new concept into
	our linking process called "communal data." Communal data can be
	declared in many modules, but only one copy of the data will exist
	in the linked .EXE file. (It is similar to the concept of COMMON
	blocks in FORTRAN.)
	
	In C, data declared outside of a function without a storage class is
	now considered to be communal data. (This is a change from previous
	versions.) Communal data declarations generate no definitions, just
	declarations; whereas initialized, or global, data declarations
	generate both definitions and declarations.
	
	Communal declarations may refer to a global definition. If they do,
	the linker simply adjusts the address as necessary. However, if
	there is no global definition of the variable, the linker combines
	the declarations into one definition and allocates the appropriate
	amount of space. For example, it is legal to declare
	
	   int x;
	
	in several different modules without a corresponding
	
	   int x = 0;
	
	Communal declarations are NOT copied into libraries. (This is
	documented on Page 84 of the "Microsoft C Language Reference Manual.")
	If you want the variable to appear in a library, it MUST be
	initialized so that it is global rather than communal. Communal
	variables are not included in libraries because they can cause
	strange conflicts. For example, let's suppose you
	unwittingly used a variable name that was also the name of a communal
	variable in your library. At link time, the linker would allocate
	only ONE copy of that variable without generating any warning.
	
	The symptom would be that your variable would mysteriously change
	every time you called the library function that used the communal
	variable. This problem would be a very difficult to trace.
	
	Now that we understand communal variables and how they interact with
	libraries, we can answer your questions.
	
	The first question was basically, "Why don't my communal variables
	show up in the library listing?" Because communal data is not placed
	into the library, it won't show up in the listing.
	
	The second question was, "How come the communal variable shows up in
	the .EXE file if I link it from an .OBJ file but not from a .LIB
	file?" It shows up from the .OBJ file because the communal variable
	is allocated space by the linker if it doesn't resolve to a global
	definition. It does NOT appear in the link produced by the .LIB file
	because it does not appear in the library dictionary.
	
	Note: this behavior is the result of doing something we ask you not to
	do; namely, putting communal data in a library. Data intended to be
	placed in a library must be initialized.
