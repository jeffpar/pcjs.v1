---
layout: page
title: "Q41104: Libraries Added by the Comment pragma Appear After Default"
permalink: /pubs/pc/reference/microsoft/kb/Q41104/
---

	Article: Q41104
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 11-SEP-1989
	
	Page 12 of the "Microsoft C for MS OS/2 and MS-DOS Operating Systems:
	Version 5.1 Update" manual states that when using the library option
	of the comment pragma, the specified library name will be inserted
	before the default library name in the object module. This is not the
	case; the given library name appears after the default library name.
	This agrees with the next statement in the documentation that states
	that using this pragma is the same as giving the library to LINK on
	the command line.
	
	If the order of the default library and an added library is important,
	compiling with the /Zl switch will prevent the default library name
	from being placed in the object module. A second comment pragma then
	can be used to insert the name of the default library after the added
	library. The libraries listed with these pragmas will appear in the
	object module in the same order they are found in the source code.
