---
layout: page
title: "Q59069: Missing Right Parenthesis in Sample NMAKE File Hangs Machine"
permalink: /pubs/pc/reference/microsoft/kb/Q59069/
---

## Q59069: Missing Right Parenthesis in Sample NMAKE File Hangs Machine

	Article: Q59069
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | h_fortran s_quickc s_quickasm buglist1.00
	Last Modified: 15-MAR-1990
	
	If you forget the right parenthesis in an IF "$(flag)"=="comparison"
	line in a makefile and run the makefile through NMAKE, you can receive
	machine hangs or corrupt COMMAND.COM messages under DOS or an Internal
	Processing Error under OS/2.
	
	Microsoft has confirmed this to be a problem with Version 1.00. We are
	researching this problem and will post new information here as it
	becomes available.
	
	The following makefile, simplified from the sample makefile on Page
	172 of the "QuickC ToolKit" manual, demonstrates this problem:
	
	debug=Y
	CC=qcl
	!CMDSWITCHES +D
	HELLO.EXE : HELLO.OBJ
	!IFDEF debug
	!   IF "$(debug"=="y"
	                LINK /CO hello;
	!   ELSE
	                LINK hello;
	!   ENDIF
	!ELSE
	!   ERROR Macro named debug is not defined.
	!ENDIF
	
	Adding a right parenthesis after "$(debug solves the problem.
	
	The error seems to occur because NMAKE does not recognize the end of
	the line and continues to parse the line until the end of the file. A
	customer has reported receiving "U1076, Line too long" messages,
	followed by a DOS level error reading "Invalid COMMAND.COM - system
	halted."
	
	Testing the same problem under an OS/2 1.20 DOS Box returned Internal
	Processing Errors and halted the system with no other error messages.
