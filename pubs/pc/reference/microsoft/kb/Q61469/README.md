---
layout: page
title: "Q61469: Bound Program Works Under OS/2, but Hangs Under DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q61469/
---

## Q61469: Bound Program Works Under OS/2, but Hangs Under DOS

	Article: Q61469
	Version(s): 1.10   | 1.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_bind h_fortran s_link
	Last Modified: 15-JAN-1991
	
	If you use BIND version 1.10 and the OS/2 Linker/2 Version 1.20, the
	program will bind error-free and will run correctly under OS/2, but
	will hang the machine if run under DOS.
	
	BIND version 1.10 creates an executable that hangs under DOS but runs
	correctly in OS/2 if the program is linked with the OS/2 linker
	version 1.20. Using BIND 1.10 with LINK version 5.03 resolves this
	problem, and using BIND 1.20 or later with the OS/2 linker also
	creates a valid executable for DOS and OS/2.
