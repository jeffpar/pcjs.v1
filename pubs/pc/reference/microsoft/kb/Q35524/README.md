---
layout: page
title: "Q35524: Separating TOOLS.INI Entries for M"
permalink: /pubs/pc/reference/microsoft/kb/Q35524/
---

## Q35524: Separating TOOLS.INI Entries for M

	Article: Q35524
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 6-JAN-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	Making Separate TOOLS.INI Entries for M if You Want to Have Different
	Configurations for M Running Under DOS, OS/2 Real Mode, or OS/2
	Protected Mode, or a Combination of the Three
	
	Various combinations of tags can be used in TOOLS.INI to set up
	different configurations for different environments. Each environment
	has its own recognized tag. The following is an example:
	
	Environment:                  Tag:
	
	MS-DOS                        [M-3.30] (your particular
	                                       DOS version)
	OS/2 real mode                [M-10.0R]
	OS/2 protected mode           [M-10.0]
	
	The following is an examples of combinations:
	
	MS-DOS and OS/2 real mode     [M-3.30 M-10.0R]
	OS/2 real and protected mode  [M-10.0R M-10.0]
	
	If you have renamed M.EXE, the "M" used in the tag must be replaced
	with the name you are using for the editor. However, each M-XX.XX
	sub-tag only can appear once in a tag. For example, if you used the
	double tags above, and you were running M in OS/2 real mode, only the
	information from first tag would be loaded.
	
	By using these tags, only certain sections will be loaded from
	TOOLS.INI to initialize the editor, depending on the environment in
	which the editor is running. The statements in the [M] section are
	always loaded.
