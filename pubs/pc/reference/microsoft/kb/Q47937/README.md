---
layout: page
title: "Q47937: /L Must Give Full Pathname to .DLL Unless in Current Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q47937/
---

## Q47937: /L Must Give Full Pathname to .DLL Unless in Current Directory

	Article: Q47937
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 16-AUG-1989
	
	When debugging dynamic link modules with CodeView Protect (CVP), you
	must use the /L switch. Before invoking CVP, make certain that the
	.DLL is in the LIBPATH specified in the CONFIG.SYS file. When invoking
	CVP with the /L switch, if the .DLL is not located in the current
	directory, you must specify the full drive and pathname to the DLL. An
	example is the following:
	
	   CVP /L d:\os2\dll\stdll.dll stmain.exe
	
	In this example, the full drive and pathname are given for the DLL to
	be debugged. If the full pathname is not given, CodeView will come up.
	However, you will be unable to step into the DLL. CodeView will simply
	step over that call.
