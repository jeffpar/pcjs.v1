---
layout: page
title: "Q46384: Example Program RECORD2.C Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q46384/
---

## Q46384: Example Program RECORD2.C Is Incorrect

	Article: Q46384
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 17-JUL-1989
	
	The QuickC example program RECORD2.C modifies memory pointed to by an
	uninitialized pointer (recpos). RECORD2.C is the example program in
	on-line help for the functions fgetpos and fsetpos.
	
	If this program is executed with pointer check enabled, execution may
	terminate with the following diagnostic displayed:
	
	   run-time error R6013
	   - illegal far pointer use
	
	If RECORD2.C is executed without pointer check enabled, the system may
	crash, or it may appear to execute successfully.
	
	To correct this problem add an additional header file, as
	follows:
	
	   #include <malloc.h>
	
	Also, replace the line
	
	   fpos_t *recpos;
	
	with the following:
	
	   fpos_t *recpos = malloc(sizeof(fpos_t));
