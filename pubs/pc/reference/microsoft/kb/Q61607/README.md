---
layout: page
title: "Q61607: U1355 Bad Command or File Name"
permalink: /pubs/pc/reference/microsoft/kb/Q61607/
---

## Q61607: U1355 Bad Command or File Name

	Article: Q61607
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr filename
	Last Modified: 27-SEP-1990
	
	The following undocumented error may occur when attempting to run an
	executable file such as CL.EXE, LINK.EXE, NMAKE.EXE, etc., from inside
	the Programmer's WorkBench (PWB).
	
	   U1355 Bad Command or File Name
	
	The error occurs because the directory containing the .EXE file is not
	specified in the search path or an incorrect LINK.EXE is being
	executed.
	
	This problem can be corrected by adding the missing directory name(s)
	to the path in the AUTOEXEC.BAT or STARTUP.CMD and rebooting, or
	executing NEW-VARS.BAT or NEW-VARS.CMD. If an incorrect linker is the
	problem, the search path can be rearranged to find the new version of
	the linker first, or the old linkers can be deleted or renamed.
	Finally, it may be necessary to delete the CURRENT.STS and PROG.STS
	files before the PWB will work correctly. This error is not documented
	in the PWB online help.
