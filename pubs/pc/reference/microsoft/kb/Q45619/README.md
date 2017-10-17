---
layout: page
title: "Q45619: Linker Errors L4013, L2048, and L4038: Overlaying in OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q45619/
---

## Q45619: Linker Errors L4013, L2048, and L4038: Overlaying in OS/2

	Article: Q45619
	Version(s): 5.01.20 | 5.03
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | S_C H_Fortran
	Last Modified: 21-JUN-1989
	
	The linker does not overlay files when linking with protected mode
	run-time libraries. If told to overlay a program that is being linked
	with a protected mode run-time library, the linker responds with one
	or more of the following errors:
	
	   LINK : warning L4013: invalid option for new-format executable file
	   ignored
	   LINK : error L2048: Microsoft Overlay Manager module not found
	   LINK : warning L4038: program has no starting address
	
	possibly followed by (in DOS):
	
	   run-time error R6001
	   - null pointer assignment
	
	or possibly followed by (in OS/2):
	
	   A general protection (GP) fault. It may also go into an infinite
	   loop after creating the temporary file (for large executables).
	
	The workaround is to create two versions of the executable, an
	overlayed DOS version and a non-overlayed OS/2 version.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
