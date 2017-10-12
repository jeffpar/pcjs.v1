---
layout: page
title: "Q50711: &quot;.&quot; on the LIBPATH Eases DLL Debugging, But Not for CVP 2.20"
permalink: /pubs/pc/reference/microsoft/kb/Q50711/
---

	Article: Q50711
	Product: Microsoft C
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 10-NOV-1989
	
	When debugging OS/2 DLLs with protected mode CodeView (CVP), you must
	specify each DLL on the command line with an /L switch, and the DLL
	must be in the current directory as well as in a directory on the
	LIBPATH as set in CONFIG.SYS.
	
	For ease of debugging, if you put a period ("."), which means the
	current directory, as one of the directories on your LIBPATH, then a
	DLL in the current directory will also be on the LIBPATH and you won't
	need to have two copies of a DLL present on disk for debugging.
	
	This method only works for versions of CVP beginning with 2.30. CVP
	Version 2.20 will not recognize DLLs in a "." LIBPATH directory.
	
	If a copy of the DLL called by the program being debugged is not in
	the current working directory, you will not be able to trace into the
	DLL. If a copy of the DLL is not in a LIBPATH directory, CodeView will
	not be able to find the DLL. In this case, instead of coming up in the
	usual "debugging mode," CodeView immediately exits and returns to the
	command prompt after several seconds.
	
	Many DLL debugging problems arise from the fact that the copy of a DLL
	that is on the LIBPATH may be inadvertently out of date compared to
	the version in the current directory that is being used for debugging.
	By putting a period on the LIBPATH, the current directory becomes a
	LIBPATH directory and only one copy of the DLL needs to exist, thus
	eliminating any DLL update inconsistencies.
