---
layout: page
title: "Q49757: Command Line Too Long in Makefile Can Cause Error: U1082"
permalink: /pubs/pc/reference/microsoft/kb/Q49757/
---

## Q49757: Command Line Too Long in Makefile Can Cause Error: U1082

	Article: Q49757
	Version(s): 1.00 1.01 1.10 1.11 1.12 | 1.11 1.12
	Operating System: MS-DOS                   | OS/2
	Flags: ENDUSER | s_make
	Last Modified: 24-JAN-1991
	
	NMAKE and MAKE require that all commands issued after a target
	dependency are less than the DOS command-line limit of 128 characters.
	If the command is too long, you may receive the following error
	
	   U1082:  Not enough memory '...' cannot execute '...'
	
	where '...' is the command that was attempted. This problem most
	likely occurs with the link command line and can be easily resolved
	with a response file. Response files are documented in the utilities
	manual or the online help supplied with each compiler.
