---
layout: page
title: "Q39915: Misleading Information about Linker Options with /link"
permalink: /pubs/pc/reference/microsoft/kb/Q39915/
---

	Article: Q39915
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 30-DEC-1988
	
	Pages 120-123 of the "Microsoft C 5.1 Optimizing Compiler User's
	Guide" describe options that can be used with the linker. The manual
	states that these options have equivalent options that can be used on
	the compiler command line. This subject can be confusing.
	
	If you are compiling and linking through the CL driver, then compile
	options are available to pass options to the link command line. For
	example, the /Fm option passes the /MAP option to the linker and a
	map file is produced.
	
	If a compiler option is not available for the linker option you want
	to pass to the link command line, the /link compile option can be
	used. The linker option can be given after /link option on the CL
	command line.
