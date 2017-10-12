---
layout: page
title: "Q47763: CMD.EXE Shell Fails with Incorrect COMSPEC"
permalink: /pubs/pc/reference/microsoft/kb/Q47763/
---

	Article: Q47763
	Product: Microsoft C
	Version(s): 1.00 1.02
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 26-SEP-1989
	
	Question:
	
	When I attempt to shell out of the MEP editor environment via the
	Shell editor function (SHIFT+F9), why does the following message
	appear at the bottom of the screen?
	
	   Spawn failed on C:\OS2\CMD.EXE   - No such file or directory
	
	Response:
	
	The problem is usually due to an incorrect setting of the COMSPEC
	environment variable in the CONFIG.SYS file. A faulty setting of this
	variable, which informs the operating system of the command
	interpreter's location, prevents the DOS EXEC system call from finding
	and executing the command interpreter. Use the following procedure to
	eliminate the problem:
	
	1. Verify that the CMD.EXE file is in the directory specified by the
	   COMSPEC environment variable.
	
	2. Ensure the syntax correctness of the COMSPEC setting. There should
	   be no spaces on either side of the equal sign, and a carriage
	   return must appear immediately following the last character of the
	   path and filename setting.
	
	       Correct example:       SET COMSPEC=C:\OS2\CMD.EXE<cr>
	
	       Incorrect examples:    SET COMSPEC = C:\OS2\CMD.EXE<cr>
	                              SET COMSPEC=C:\OS2\CMD.EXE;<cr>
	                              SET COMSPEC=C:\OS2\CMD.EXE<space><cr>
	
	Under MEP 1.02, the COMSPEC environment variable is used to locate the
	command interpreter. If the command interpreter is not found according
	to the COMSPEC variable, the "Spawn failed...." error message is
	displayed. MEP Version 1.02 does not use the PATH environment variable
	for additional searching of CMD.EXE.
	
	Under MEP Version 1.00, however, the PATH variable is used when the
	CMD.EXE is not found via the COMSPEC setting. Hence, if the spawn
	failure error occurs when attempting to shell out of the MEP 1.00
	environment, examine the COMSPEC setting and also verify that CMD.EXE
	is traversed by the search path of the PATH environment variable in
	the CONFIG.SYS.
