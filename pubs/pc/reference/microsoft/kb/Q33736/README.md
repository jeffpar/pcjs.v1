---
layout: page
title: "Q33736: CHAIN, RUN, and KILL Statements Do Not Use MS-DOS Search PATH"
permalink: /pubs/pc/reference/microsoft/kb/Q33736/
---

## Q33736: CHAIN, RUN, and KILL Statements Do Not Use MS-DOS Search PATH

	Article: Q33736
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_BasicInt B_GWBasicI B_BBasic
	Last Modified: 16-DEC-1989
	
	The CHAIN "FILESPEC", RUN "FILESPEC", and KILL "FILESPEC" statements
	do not use the search path of the MS-DOS PATH (or APPEND) command to
	find the specified file. Therefore, the file that a BASIC program
	wants to CHAIN, RUN, or KILL either must be on the default disk or
	directory, or the explicit path must be specified in the "FILESPEC"
	argument. Non-compliance results in the error message "File not
	Found."
	
	This information applies to all versions of Microsoft BASIC, including
	the following:
	
	1. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	3. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	5. Microsoft GW-BASIC Interpreter Versions 3.20 and later
	
	6. Microsoft BASIC Interpreter Version 5.28 for MS-DOS
	
	The MS-DOS PATH command may be used to specify the search path for the
	compiled BASIC run-time module, BRUNxx.EXE.
	
	Normally, all programs that are CHAINed or RUN together are put in the
	same directory. This works even if they use different BRUNxx.EXE files
	(taken from different compiler versions) for programs that are
	executed with RUN "FILESPEC", but does not work for CHAIN "FILESPEC".
	
	If you specify the explicit disk and directory path in the CHAIN or
	RUN statement in the program source code, the program will have to be
	recompiled if the CHAINed or RUN program is moved to a different disk
	and/or directory.
