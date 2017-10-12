---
layout: page
title: "Q59479: Cannot Open Compiler Intermediate File"
permalink: /pubs/pc/reference/microsoft/kb/Q59479/
---

	Article: Q59479
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-DEC-1990
	
	In DOS mode, the error number for the "cannot open compiler
	intermediate file" message is C1042; in OS/2, the error number is
	C1043. This is caused by an incorrect setting of the TMP environment
	variable, when a semicolon ends the path. For example:
	
	   TMP=C:\TMP;
	
	This causes the compiler to return the following error message:
	
	   fatal error C1042: cannot open compiler intermediate file -- DOS
	
	or
	
	   fatal error C1043: cannot open compiler intermediate file -- OS/2
	
	The correct way to set up the TMP environment variable is as follows:
	
	   >SET TMP=C:\TMP<RETURN>
	
	It is important that the environment string does not end with a
	semicolon because the compiler appends the intermediate filename to
	the TMP path. By removing the semicolon from the path, the compiler
	can create the file correctly.
	
	Since there are other Microsoft products that utilize the TMP
	environment variable, it is safe to remove the semicolon from the end
	of the TMP environment variable path.
	
	This is true only for the TMP variable because other environment
	variables are used only for a search path.
