---
layout: page
title: "Q59535: Why the /HIGH Switch Is Not Used with High-Level Languages"
permalink: /pubs/pc/reference/microsoft/kb/Q59535/
---

## Q59535: Why the /HIGH Switch Is Not Used with High-Level Languages

	Article: Q59535
	Version(s): 3.65
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-MAR-1990
	
	The linker option /HIGH is used with assembly language programs to
	load an .EXE file as high as possible in memory. Without the /HIGH
	option, LINK places the .EXE file as low as possible.
	
	/HIGH is not used with high-level languages because it prohibits the
	use of dynamic memory allocation by the program. Furthermore, C
	run-time start-up code specifies /DOSSEG, which forces low load and
	Microsoft run-time segment layout.
	
	When a program is linked with /HIGH, MS-DOS loads the program at the
	highest possible memory location available, usually 0xFFF0. All memory
	between the program's segments (which are high) and the program's PSP
	(which is low) is now considered program RAM, owned by the program.
	You can no longer allocate or free that memory.
	
	Therefore, calls to routines such as malloc() and free() fail. This
	causes problems for the following reasons:
	
	1. Some memory is dynamically allocated during function calls from
	   high-level languages.
	
	2. The memory structure required by Microsoft high-level languages for
	   tracking used/freed memory is not available.
	
	You can use /HIGH if you write your own start-up code, but your
	programs cannot call most of the routines from the C run-time library.
	
	The only reason /HIGH is still available to the linker is that early
	versions of Microsoft FORTRAN and Microsoft Pascal generated code that
	had to be linked with /DSALLOCATE, which relocates all addresses
	within DGROUP in such a way that the last byte in the group has the
	offset 0xFFFF. The /HIGH switch is used in conjunction with the
	/DS(ALLOCATE) switch.
	
	For more information, search the knowledge base with the following
	query:
	
	   S_LINK and /HIGH and /DS
	
	You can also read the section "Using the /HIGH and /DSALLOCATE
	Switches" on Page 719 ff in the "MS-DOS Encyclopedia."
