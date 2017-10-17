---
layout: page
title: "Q48689: CodeView Version 2.20 Is Called CVPCK.EXE by DOS Version 2.10"
permalink: /pubs/pc/reference/microsoft/kb/Q48689/
---

## Q48689: CodeView Version 2.20 Is Called CVPCK.EXE by DOS Version 2.10

	Article: Q48689
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER | CV CVPCK CVPACK 2.x
	Last Modified: 21-SEP-1989
	
	Question:
	
	When trying to invoke CodeView Version 2.20 under DOS Version 2.10 or
	2.11, I get the messages "Cannot Find CVPCK.EXE" and "Please enter new
	program spec:". How can I get CodeView 2.20 to work under DOS Versions
	2.1x?
	
	Response:
	
	If you rename CV.EXE to CVPCK.EXE, you can run CodeView Version 2.20
	under DOS Version 2.10 or 2.11. You must also rename CV.HLP to C.HLP
	to make the on-line help accessible.
	
	CodeView Version 2.20 is included with C Version 5.10, FORTRAN Version
	4.10, Pascal Version 4.00, and Macro Assembler (MASM) Version 5.10.
	
	Many people mistakenly assume that CodeView is actually looking for
	CVPACK.EXE, which also comes with the software packages listed above.
	If you rename CVPACK.EXE to CVPCK.EXE and then try to run CVPCK.EXE,
	you will receive the error message "overlay not found." If you receive
	this error, delete CVPCK.EXE, copy both CV.EXE and CVPACK.EXE from the
	installation disks, and follow the instructions above.
	
	Under DOS Versions 3.x, a C program's name is available from argv[0].
	Under DOS Versions 2.x, argv[0] always equals the letter "C", so
	programs that need to find themselves under DOS Versions 2.x also have
	their own names hard coded as the filename to locate. Unfortunately,
	the hard-coded name within CodeView Version 2.20 is "CVPCK.EXE", so
	this is what it looks for under DOS Versions 2.x.
