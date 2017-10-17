---
layout: page
title: "Q68234: Recursively Calling NMAKE Using the MAKEFLAGS Macro"
permalink: /pubs/pc/reference/microsoft/kb/Q68234/
---

## Q68234: Recursively Calling NMAKE Using the MAKEFLAGS Macro

	Article: Q68234
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 17-JAN-1991
	
	According to page 113 of the "Microsoft C Advanced Programming
	Techniques" manual, if you want to invoke NMAKE recursively, the macro
	$(MAKEFLAGS) can be used to pass the command-line switches to the
	recursively invoked NMAKE. However, the $(MAKEFLAGS) macro will
	contain only the letters of the switches and will not contain the
	actual command-line syntax.
	
	For example, if the original command line contained "/D /N", the
	$(MAKEFLAGS) macro will contain "DN". This results in NMAKE trying to
	use the $(MAKEFLAGS) macro as the name of the makefile, rather than as
	command-line switches. To use the $(MAKEFLAGS) macro to invoke NMAKE
	recursively, it is necessary to precede it with a hyphen (-) or
	forward slash (/) so that NMAKE uses the macro as a set of
	command-line switches. The documentation should read:
	
	   $(MAKE) -$(MAKEFLAGS)
