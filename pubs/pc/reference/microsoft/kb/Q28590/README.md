---
layout: page
title: "Q28590: Microsoft Editor Fails to Find TOOLS.INI Using DOS Version 2.x"
permalink: /pubs/pc/reference/microsoft/kb/Q28590/
---

## Q28590: Microsoft Editor Fails to Find TOOLS.INI Using DOS Version 2.x

	Article: Q28590
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 20-OCT-1988
	
	Problem:
	
	When running the M.EXE editor under DOS Versions 2.x, the editor does
	not find the TOOLS.INI file. The error reported is "Unable to Read
	TOOLS.INI[]".
	
	The following demonstrates the problem:
	
	1. Rename QUICK.INI to TOOLS.INI.
	2. Set the environment variable INIT to the directory c:\mytools
	   as follows:
	
	   SET INIT=c:\mytools
	
	3. Load the M.EXE editor. It will come up with default settings,
	   instead of reading TOOLS.INI.
	
	When running DOS Version 3.20 on an IBM PC AT, M.EXE correctly finds
	the TOOLS.INI file.
	
	Response:
	
	M.EXE and MEP.EXE use their startup name to find the right section in
	TOOLS.INI. For example, if you rename the editor to Z, it will look
	for [z] instead of [m] in the editor's section in TOOLS.INI.
	
	This process occurs in all cases except under DOS Versions 2.x. Under
	any 2.x version of DOS, the name of your program is not available, and
	instead, the compiler provides the arbitrary name "C".
	
	To work around this limitation in DOS Versions 2.x, change the
	editor's tagged section in TOOLS.INI file to use the tag [c] instead
	of [m]. If it is necessary to share files with DOS Versions 3.x
	systems, the editor's section in TOOLS.INI can be tagged [m c].
	
	The editor uses the same method to name the following, where * is
	replaced by the editor name or by "C" under DOS Versions 2.x:
	
	1. The virtual memory file, *-XXXX.VM
	2. The history-and-state file, *.TMP
	3. The compiler message file, *.MSG
