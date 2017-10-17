---
layout: page
title: "Q38961: &quot;Input Run-Time Module Path:&quot; on DOS 2.10; QuickBASIC 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q38961/
---

## Q38961: &quot;Input Run-Time Module Path:&quot; on DOS 2.10; QuickBASIC 4.50

	Article: Q38961
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 9-DEC-1988
	
	If BRUN45.EXE is not in the current directory or MS-DOS path, then any
	program compiled with QuickBASIC Version 4.50 requiring the BRUN45.EXE
	run-time module and running under DOS Version 2.10 will get the
	following message:
	
	   "Input run-time module path :"
	
	If you respond to this prompt and input the complete drive and
	subdirectory name to locate BRUN45.EXE, then the prompt will still
	occur, and the run-time module will not be found. (This problem does
	not occur with versions of QuickBASIC earlier than Version 4.50.)
	
	This problem only occurs under DOS Version 2.10. On versions of DOS
	later than Version 2.10, typing in the path correctly satisfies the
	above prompt.
	
	To work around the problem and avoid the "Input run-time module path"
	prompt, set a PATH environment variable in MS-DOS that includes the
	run-time module in the path, as in the following example:
	
	   SET PATH=c:\subdir
