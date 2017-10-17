---
layout: page
title: "Q50703: C and Pascal Mixed Language: Declare C Libraries First"
permalink: /pubs/pc/reference/microsoft/kb/Q50703/
---

## Q50703: C and Pascal Mixed Language: Declare C Libraries First

	Article: Q50703
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_PASCAL S_LINK
	Last Modified: 30-NOV-1989
	
	When doing mixed language programming with C Version 5.10 and Pascal
	Version 4.00, be sure to use the /NOD and /NOE linker switches, and
	then specifically link with the C libraries before the Pascal
	libraries. This will prevent the linker from finding multiply defined
	symbols.
	
	The linker will often report error L2025 when linking with the Pascal
	library first, depending on what functions are called from C. The
	printf() function is one example of a run-time function that will
	cause this problem. The problem occurs because some of the low-level
	routines involved in both libraries have the same name.
	
	The following example typifies the problems encountered:
	
	For instance, say that the Pascal library contains an object module
	with a routine called A, and the C library contains an object module
	with routine A as well as routine B.
	
	Furthermore, suppose the Pascal code makes a call to the A library
	routine and the C code makes a call to the B library routine.
	
	If the Pascal libraries are linked first, the A .OBJ will be found in
	the Pascal library, then the A and B .OBJ will be brought in from the
	C library to resolve the call to B. This results in the linker
	receiving two copies of routine A, which causes the error. By linking
	the C library first, only the one object module (with both A and B)
	will be found, and the symbol will not be multiply defined.
