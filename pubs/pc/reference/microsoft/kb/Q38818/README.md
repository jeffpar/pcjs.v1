---
layout: page
title: "Q38818: Error L2029 Unresolved Externals"
permalink: /pubs/pc/reference/microsoft/kb/Q38818/
---

## Q38818: Error L2029 Unresolved Externals

	Article: Q38818
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm s_quickc s_link s_error
	Last Modified: 11-JAN-1990
	
	The following error is from "Linker Error Messages" in the manual
	"CodeView and Utilities", Section C.2, Page 368, and in the "Microsoft
	QuickC Compiler Programmer's Guide," Section D.4, Page 373:
	
	L2029       unresolved externals
	
	            One or more symbols were declared to be external in one or
	            more modules, but they were not publicly defined in any of
	            the modules or libraries. A list of the unresolved
	            external references appears after the message, as shown in
	            the following example:
	
	            EXIT in file(s):
	             MAIN.OBJ (main.for)
	            OPEN in file(s):
	             MAIN.OBJ (main.for)
	
	            The name that comes before in file(s) is the unresolved
	            external symbol. On the next line is a list of object
	            modules that have made references to this symbol. This
	            message and the list are also written to the map file, if
	            one exists.
	
	Nonfatal errors indicate problems in the executable file. LINK
	produces the executable file. Nonfatal error messages have the
	following format:
	
	   location : error L2xxx: messagetext
	
	In these messages, location is the input file associated with the
	error, or LINK if there is no input file. If the input file is an OBJ
	or LIB file and has a module name, the module name is enclosed in
	parentheses.
	
	This linker error message means that a reference to a function or
	procedure was made, but the actual routine to that reference was never
	found (in either a library or in another object module). This message
	is not in regards to inclusion or exclusion of include files in a C
	program. (Include files in a C program usually do not contain
	functions, but rather function prototypes.) If this error message
	should occur, check the following:
	
	1. Make sure the command line used to invoke the linker or the
	   compiler/linker is correct.
	
	2. Check that you have specified all libraries that are needed by
	   the program (e.g. graphics.lib, a third-party library).
	
	3. Check the spelling of the procedure or function name in the
	   program and make sure it corresponds to how the function is
	   actually declared.
	
	4. Make a listing of the libraries that are being linked with to
	   see if the missing procedure or function is indeed in the library.
	   This process will require the use of LIB.EXE.
	
	5. If you are in QuickC and this message occurs, check to see if
	   the function that is being called is contained in the core library.
	   If it isn't, you need to set a Program List in the QuickC editor.
	
	6. Check the name that the linker can't resolve. If the name is
	   preceded by two underscores, then most likely it is either an
	   internal routine for startup or other internal functions or the
	   library was built with an incorrect version of LIB.
	
	Make sure a main() has been declared and/or a function in C wasn't
	preceded with an undesired underscore. This error can also occur if a
	C program is being mixed with an assembler routine and the assembler
	routine was not assembled with the /MX and /ML options to preserve the
	case of the functions, or the function in the assembler program didn't
	have an underscore in front of its name to make it compatible with the
	C naming convention.
