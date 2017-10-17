---
layout: page
title: "Q64024: C 6.00 UNDEL.EXE Is Not Compatible with the Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q64024/
---

## Q64024: C 6.00 UNDEL.EXE Is Not Compatible with the Microsoft Editor

	Article: Q64024
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	If backup copies of files are stored in the \DELETED subdirectory by
	the M Editor, typing "undel" should bring up a listing of backup
	copies. However, if the C 6.00 version of UNDEL.EXE is used, the
	following message will be displayed: "
	
	   0(0) bytes in 0 deleted files.
	
	The C 5.10 version of UNDEL.EXE will successfully bring up a listing
	of backup copies saved by either the M Editor or the Programmer's
	WorkBench (PWB).
	
	This problem can be reproduced by setting the text backup switch in
	the M section of the TOOLS.INI file to "undel". After saving various
	copies, backups are added to the \DELETED subdirectory and a listing
	can be brought up by using the C 5.10 UNDEL.EXE. Using the C 6.00
	version of UNDEL.EXE causes the erroneous message listed above to be
	displayed. This incompatibility was caused by adding OS/2 version 1.20
	filename support to UNDEL.EXE and EXP.EXE.
	
	As a workaround, rename the C 5.10 UNDEL.EXE to UNDEL51.EXE and the C
	6.00 UNDEL.EXE to UNDEL60.EXE.
