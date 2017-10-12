---
layout: page
title: "Q47931: Linker Error L1063 and Linking Over 1000 Object Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q47931/
---

	Article: Q47931
	Product: Microsoft C
	Version(s): 5.01.21 5.03
	Operating System: OS/2
	Flags: ENDUSER | S_C S_CodeView
	Last Modified: 16-AUG-1989
	
	Question:
	
	When attempting to link a large OS/2 application consisting of over
	1500 object modules with C 5.10's Link 5.01.21 or FORTRAN 5.00's Link
	5.03 by using the options /co /map:2078 /noe /se:2078 /packcode, I get
	the link error "L1063 out of memory for CodeView information." Only
	one of the .C source files was compiled with /Zi. All were compiled
	with /AL. Linking without /co (CodeView information) successfully
	produces a 700K executable file (.EXE), but I need to do some
	debugging with CVP.
	
	What is the L1063 error, and how can I work around it?
	
	Response:
	
	Information on L1063 is not in the C 5.10 text files or documentation,
	but it is in Pascal 4.00's README.DOC and in FORTRAN 4.10's
	CVREADME.DOC as noted in another article in this knowledge base. The
	following reiterates the error message and its description:
	
	   L1063 out of memory for CodeView information
	
	   The linker was given too many object files with debug information,
	   and the linker ran out of space to store it. Reduce the number of
	   object files that have debug information.
	
	In this case, it is not the number of modules with CodeView
	information that is causing the problems exactly; it is the great
	number of modules and trying to link in any CodeView information.
	
	The following are ways to workaround this linker limitation:
	
	1. The most effective method is to demodularize your application. That
	   is, put more functions into fewer .C source files.
	2. Reduce the linker option /se: value to as low as possible for the
	   number of logical segments in the application.
	3. Link the object files from the current working directory. If you
	   must use different directories for your .OBJs, make the pathnames
	   as short as possible.
