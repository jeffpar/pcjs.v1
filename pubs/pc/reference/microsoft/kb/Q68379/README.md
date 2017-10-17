---
layout: page
title: "Q68379: Extmake Switch Does Not Expand Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q68379/
---

## Q68379: Extmake Switch Does Not Expand Macros

	Article: Q68379
	Version(s): 1.11   | 1.11
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.11
	Last Modified: 24-JAN-1991
	
	The following NMAKE description file shows that macro substitution
	does not occur when using the extmake switch.
	
	To show the error, set SUBDIR to a subdirectory and execute NMAKE on
	the makefile while in ANOTHER subdirectory.
	
	Sample Makefile
	---------------
	
	SUBDIR = subdir
	
	foo.exe: $(SUBDIR)\foo.c
	     cl %|pfeF
	
	Resulting command:  cl $(SUBDIR)\foo.c
	
	The workaround for this particular problem is to replace the extmake
	switch with the predefined macros (that is, $** and $?).
