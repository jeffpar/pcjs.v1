---
layout: page
title: "Q21835: Last SOUND Truncated at End of Program"
permalink: /pubs/pc/reference/microsoft/kb/Q21835/
---

## Q21835: Last SOUND Truncated at End of Program

	Article: Q21835
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-DEC-1989
	
	Question:
	
	When I put SOUND statements at the end of the program and run the .EXE
	file, why is the sound truncated at the end?
	
	Response:
	
	When a program ends, the BASIC run-time system is exited, which
	immediately stops any SOUND whose duration exceeds the time taken to
	execute any remaining statements in the program. If you have
	QuickBASIC Version 2.00 or later, the problem will not occur in the
	editor environment, because the run-time system is still available.
	
	To give the program time to complete its SOUND statements, give the
	program something to do after the SOUND (a dummy loop for example) so
	that the SOUND has time to finish before the program terminates.
