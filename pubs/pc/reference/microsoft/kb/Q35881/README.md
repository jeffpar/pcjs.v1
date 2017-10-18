---
layout: page
title: "Q35881: Name Directive No Longer Supported"
permalink: /pubs/pc/reference/microsoft/kb/Q35881/
---

## Q35881: Name Directive No Longer Supported

	Article: Q35881
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The Name directive was available in MASM Version 4.00. The directive,
	Name modulename, sets the name of the current module to modulename. A
	module name is used by the linker when displaying error messages.
	
	In MASM Versions 5.00 and 5.10, the old directive does not generate an
	assembler error because Microsoft wants to have downward compatibility
	with MASM Version 4.00 source files. The directive does not generate
	any extra information for MASM Versions 5.00 and 5.10.
