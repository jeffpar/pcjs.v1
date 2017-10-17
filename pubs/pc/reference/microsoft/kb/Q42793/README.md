---
layout: page
title: "Q42793: Fatal Error C1059: Out of Near Heap Space"
permalink: /pubs/pc/reference/microsoft/kb/Q42793/
---

## Q42793: Fatal Error C1059: Out of Near Heap Space

	Article: Q42793
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-MAY-1989
	
	Using the /Zg compiler option to generate function declarations from
	the function definitions can cause the following error:
	
	   Fatal error C1059: Out of near heap space.
	
	You may be able to free more space on the near heap by invoking the
	compiler in two passes, as follows:
	
	        cl /P filename.c
	        cl /Zg /c /Tc filename.I
	
	The first pass processes the preprocessor statements and produces an
	intermediate file. The second pass generates the function declarations
	from the intermediate file.
	
	Both the preprocessor and the compiler /Zg option use the near heap.
	The preprocessor uses the near heap to evaluate macro expansions. The
	compiler /Zg option uses the near heap while producing the function
	declaration listing.
