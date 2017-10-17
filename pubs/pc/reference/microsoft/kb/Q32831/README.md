---
layout: page
title: "Q32831: Link Error 4051"
permalink: /pubs/pc/reference/microsoft/kb/Q32831/
---

## Q32831: Link Error 4051

	Article: Q32831
	Version(s): 3.60 3.61 3.64 3.65 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 22-JUL-1988
	
	If you receive link error 4051, check the following:
	
	   1. Is the LIB environment variable set correctly? Check
	      for spaces around the equal sign or any extra characters
	      at the end of the line.
	   2. Which version of the linker is being used? Old versions of
	      the linker do not recognize the LIB environment variable.
	         Make sure the linker being used is the one that came with
	      the product.
	   3. Are the library names being asked for component libraries or
	      combined libraries? Libraries compiled under C Version 4.00 or
	      earlier have component library names embedded in the .OBJ files.
	      With later versions of the C compiler, combined libraries are used
	      and the component libraries will not be found.
	         This behavior also exist when upgrading from Pascal Versions 3.32
	      or earlier to Pascal Versions 4.00 or greater.
	         The work-around for this behavior is to recompile all .OBJ file
	     (and libraries) with the new compiler or to use the /NOD switch
	     when linking, and specify all the libraries (combined and otherwise)
	     to be used. The following is an example:
	
	            link /NOD  test,,,llibce.lib;
	
	   4. Is the correct library available for the math option chosen?
	   FORTRAN defaults to the co-processor library (e.g. LLIBFOR7.LIB).
	   C and Pascal default to the emulator math library (e.g. SLIBCE.LIB
	   and LIBPASE.LIB)
