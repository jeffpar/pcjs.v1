---
layout: page
title: "Q35032: Don't Place Communal Data in Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q35032/
---

	Article: Q35032
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | S_LIB S_LINK  lib link
	Last Modified: 8-SEP-1988
	
	Do not declare unitialized (communal) data in modules that will
	be placed in libraries. Doing so may result in the module not
	being included at link time.
	
	This information is documented in the last paragraph on Page 84 of the
	"Microsoft C Language Reference" manual, which states the following:
	
	"Unitialized variable declarations at the external level are
	not recommended for any file that might be placed in a library."
	
	Microsoft C supports four different storage classes for variables
	declared at the external level, as follows:
	
	1.  Static variables are local to the module and do not generate
	    external references or public definitions, i.e., no other modules
	    may reference these variables.
	
	2.  Initialized variables, without static, are allocated storage
	    and generate public definitions, i.e., other modules may share
	    these variables.
	
	3.  Uninitialized variables, with extern, are not allocated
	    storage and they generate external references, i.e, this module
	    isn't declaring the data, but it wants to share the data that other
	    modules declare.
	
	4.  Communal variables are global variables that are not initialized
	    or given the extern modifier. A communal variable is one that is
	    used by everybody but not necessarily declared public by anybody;
	    the linker will allocate storage for it, if needed.
	
	    Communal variables do not have external references or public
	    definitions. When the program is linked, if a public definition
	    with the same name is found, all communal declarations are treated
	    as external references. If no definition is found, the linker will
	    allocate storage and again the communal declarations are treated
	    like references. When a module is added to a library, the librarian
	    takes all public definitions and adds them to the dictionary to be
	    searched when the linker resolves references to the library.
	
	Note: Communal variables are NOT added to the dictionary. To do so
	would cause conflicts with other communal declarations and a possible
	public definition.
	
	A good way to declare data in a multi-module program is to use a
	single module that contains public definitions while every other
	module uses the extern modifier. You do not need to actually
	initialize all variables in this one module as long as one of them is
	initialized. This process is sufficient to force the module to be
	brought in while linking.
