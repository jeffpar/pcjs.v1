---
layout: page
title: "Q63422: B_OVREMAP in 7.00 Programmer's Guide Should Be B_OVLREMAP"
permalink: /pubs/pc/reference/microsoft/kb/Q63422/
---

## Q63422: B_OVREMAP in 7.00 Programmer's Guide Should Be B_OVLREMAP

	Article: Q63422
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900613-56 docerr
	Last Modified: 16-JAN-1991
	
	Page 613 of "Microsoft BASIC 7.0: Programmer's Guide" (for versions
	7.00 and 7.10) incorrectly refers to the B_OVREMAP routine. This
	routine (contained in the BASIC run-time) is actually named
	B_OVLREMAP.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The B_OVLREMAP routine is used to remap the overlays in expanded
	memory after the state has changed. To use this from a BASIC program,
	you must map the name to a usable SUB name using the ALIAS keyword in
	the DECLARE SUB line.
	
	Code Example
	------------
	
	The following code example demonstrates the use of the B_OVLREMAP
	routine:
	
	   DECLARE SUB OvlReMap ALIAS "B_OVLREMAP"
	   SHELL             'Do something to expanded memory in the SHELL
	   CALL OvlReMap     'Remap overlays in expanded memory after SHELL
	   END
