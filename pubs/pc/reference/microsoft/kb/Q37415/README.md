---
layout: page
title: "Q37415: QuickBASIC 4.50 and Earlier May Not Work with MS-DOS 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q37415/
---

## Q37415: QuickBASIC 4.50 and Earlier May Not Work with MS-DOS 4.00

	Article: Q37415
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER  |
	Last Modified: 2-NOV-1988
	
	QuickBASIC Version 4.50 and earlier releases have not been tested with
	MS-DOS Version 4.00. Microsoft does not claim that QuickBASIC Version
	4.50 (and earlier versions) will work with MS-DOS Version 4.00.
	QuickBASIC Versions 4.00, 4.00b, and 4.50 require a DOS version
	between Versions 2.10 and 3.x.
	
	QuickBASIC may not work correctly with MS-DOS Version 4.00 because of
	memory-management issues. In particular, the SHELL feature fails, both
	from Shell in the File menu in the QB.EXE editing environment and from
	the SHELL statement in a compile program.
	
	The "Make .EXE" function of QuickBASIC will also not work properly in
	MS-DOS Version 4.00, because it requires a SHELL to BC.EXE and
	LINK.EXE. BC.EXE will work from the MS-DOS command line.
	
	CHAIN statement failures have also been reported with QuickBASIC
	operating under MS-DOS Version 4.00.
