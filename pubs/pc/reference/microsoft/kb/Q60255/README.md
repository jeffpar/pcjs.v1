---
layout: page
title: "Q60255: __STDC__ Is Undefined If Microsoft Extensions Are Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q60255/
---

	Article: Q60255
	Product: Microsoft C
	Version(s): 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm s_c
	Last Modified: 15-APR-1990
	
	The __STDC__ macro is defined if a C compiler is ANSI C-standard
	conforming, and is undefined in QuickC Versions 2.50 and 2.51 if
	Microsoft extensions are allowed (default). To allow the macro to be
	defined, go to Options.Make.Compiler Flags.C Language and check ANSI
	compatibility. If you are compiling from the command line, add the /Za
	switch.
	
	This macro may be used as in the following code fragment:
	
	Code Example
	------------
	
	#ifdef __STDC__
	  void foo_bar (void);
	#endif
