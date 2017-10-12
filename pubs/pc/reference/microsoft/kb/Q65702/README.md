---
layout: page
title: "Q65702: Fatal Error C1002: Out of Heap Space in Pass 2"
permalink: /pubs/pc/reference/microsoft/kb/Q65702/
---

	Article: Q65702
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 24-SEP-1990
	
	Fatal error c1002 is produced when pass 2 of the compiler (C2.EXE) can
	find no more memory available to store information that is needed to
	continue compiling. This information typically consists of defined
	variables, function names, and temporary information used when
	evaluating complex expressions. Information used for optimizing may
	even use dynamic memory, which can cause this error to occur.
	
	One of the following may be a solution:
	
	1. Divide the source file into smaller source files. This provides
	   many advantages, including the following:
	
	   a. It reduces compiling time for small changes in a program.
	
	   b. It allows the functions to be separated from the program so they
	      may be used by other programs.
	
	   c. The .OBJs may be placed into a library.
	
	   d. Placing code in separate files may aid in readability because
	      the developer does not need to search through large files.
	
	2. Break complex expressions into smaller subexpressions. Using
	   temporary variables for intermediate assignments is an example.
	   This can also help with program readability.
	
	3. If using OS/2, recompile using the /B2 C2L.EXE option. This invokes
	   the high-capacity compiler (C2L.EXE) on the second pass of the
	   compiler. C2L.EXE may cause a longer compiling time and should not
	   be used if not needed.
	
	4. If running any TSRs (terminate-and-stay-resident programs) or
	   device drivers, try removing these to free more memory. The
	   compiler does not take advantage of extended or expanded memory, so
	   try to free as much of the 640K conventional memory as possible.
	
	5. If using NMAKE, MAKE, or other program building utilities, try
	   compiling without them. These programs reside in memory when your
	   compiler is invoked. If using DOS, try running NMK.COM rather than
	   NMAKE.EXE. (Refer to the online help for differences between
	   NMK.COM and NMAKE.EXE.)
	
	6. Observe the compiling options. Change these to see if these have
	   any affect. For example, disable optimizations with /Od if
	   optimizing is currently enabled.
