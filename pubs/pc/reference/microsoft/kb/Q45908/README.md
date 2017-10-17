---
layout: page
title: "Q45908: QuickBASIC Cannot RUN or CHAIN to Batch Files; Use SHELL"
permalink: /pubs/pc/reference/microsoft/kb/Q45908/
---

## Q45908: QuickBASIC Cannot RUN or CHAIN to Batch Files; Use SHELL

	Article: Q45908
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890612-57 B_BasicCom B_GWBasicI
	Last Modified: 13-DEC-1989
	
	Batch (.BAT) files can be executed only from a BASIC program SHELL
	statement. The RUN and CHAIN statement cannot be used to execute a
	batch file.
	
	This information applies to the following BASIC products:
	
	1. Microsoft GW-BASIC Versions 3.20, 3.22, and 3.23
	
	2. QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00,
	   4.00b, and 4.50
	
	3. Microsoft BASIC Compiler Versions 6.00, and 6.00b for MS-DOS and
	   MS OS/2.
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The SHELL statement can be used to execute a .COM, .EXE, or .BAT file,
	or almost any MS-DOS command, and then return to the original BASIC
	program. However, the SHELL statement cannot pass any information or
	variables to the program or statement it is executing.
	
	The statement or program being executed from the SHELL statement is
	being executed as a "child" process of BASIC. The BASIC program is
	exited (but remains in memory), the command string is executed, and
	then control is returned to the BASIC program. Two methods can be used
	to pass information down to a batch file:
	
	1. Write the information to a file and have the batch file access the
	   file for the necessary information.
	
	2. Set a special environment variable with ENVIRON that can be read
	   by the batch file.
	
	The RUN and CHAIN statements expect to RUN or CHAIN to a program that
	has an extension of .BAS or .EXE, depending on whether the program is
	being executed within the QB.EXE or QBX.EXE environment or as a compiled
	application.
	
	For more information, consult the BASIC language reference manual
	included with your BASIC package.
