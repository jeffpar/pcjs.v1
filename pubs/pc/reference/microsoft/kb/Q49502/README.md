---
layout: page
title: "Q49502: Explanation of Why NMAKE May Not Produce .OBJ and .EXE Files"
permalink: /pubs/pc/reference/microsoft/kb/Q49502/
---

	Article: Q49502
	Product: Microsoft C
	Version(s): 1.00 1.10 1.11 | 1.00 1.11
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 27-OCT-1989
	
	Question:
	
	When using the NMAKE utility, no warnings occur and the compiler
	appears to execute properly; however, the .OBJ and .EXE files are not
	created.
	
	If I use the MAKE utility on the same .MAK file, I get the following
	two warnings:
	
	   warning U4000: Target does not exist.
	
	   warning U4001: Dependent does not exist; Target not built.
	
	The first warning message is a standard warning that I would expect.
	Why is there a second and why aren't the .OBJ and .EXE files created?
	
	Response:
	
	Remove unexpected trailing characters from the .MAK file.
	
	This problem can occur because extra characters occur at the end of a
	line within the .MAK file. Common mistakes such as placing a trailing
	semicolon in the CL compile line or in the dependency line can cause
	this behavior. This applies to any unexpected characters, not just
	semicolons.
	
	The following example demonstrates the problem:
	
	   file.obj: file.c <ENTER>
	      CL /c /Lp file.c;  <-- Semicolon CANNOT be used with the CL command.
	
	   file.exe: file.obj <ENTER>
	      LINK file;      <-- OK, Semicolon CAN be used with the LINK command.
	
	Removing the semicolon at the end of the CL line eliminates the
	problem.
