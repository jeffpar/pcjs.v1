---
layout: page
title: "Q33036: Hanging Problems When QB.EXE Editor Loads Fast-Load Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q33036/
---

## Q33036: Hanging Problems When QB.EXE Editor Loads Fast-Load Modules

	Article: Q33036
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	A hanging problem can occur when the QB.EXE editor loads eight or more
	Fast-Load format modules (listed in a .MAK file) where each module
	uses at least one $INCLUDE file. A "Loading and parsing" message
	displays as usual, but then the computer may hang. The problem does
	not occur if the separate modules are saved as text instead of in the
	"Fast Load and Save" format.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the version of QuickBASIC provided with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	QuickBASIC Version 4.50 and in the QBX.EXE environment of the
	Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	Note: This problem does not occur in QuickBASIC Versions 2.00, 2.10,
	and 3.00; these versions do not support "Fast Load and Save" format or
	the loading of multiple separate modules.
