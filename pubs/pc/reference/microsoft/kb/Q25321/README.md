---
layout: page
title: "Q25321: Using EXEHDR or EXEMOD to Change the Stack Size of an .EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q25321/
---

## Q25321: Using EXEHDR or EXEMOD to Change the Stack Size of an .EXE

	Article: Q25321
	Version(s): 1.00 2.01 | 1.00 2.01
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_exehdr s_exemod
	Last Modified: 6-FEB-1991
	
	The EXEHDR and EXEMOD utilities can be used to change the stack size
	of a program. EXEHDR runs in both DOS and OS/2, while EXEMOD is an
	older utility that only runs under DOS.
	
	To view the current size of the stack, no options are used. Both
	EXEHDR and EXEMOD will produce a table of information with a line such
	as the following:
	
	   Initial SS:SP 0000:0800 0
	
	The offset portion of this line gives the current stack size in hex.
	In this example, the stack size is set at 2K. If you wanted to change
	it to 4K, you could use the /STACK option of EXEHDR or EXEMOD in the
	following way:
	
	   EXEHDR file /STACK 1000
	
	-or-
	
	   EXEMOD file /STACK 1000
