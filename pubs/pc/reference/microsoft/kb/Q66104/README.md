---
layout: page
title: "Q66104: Use of _far Keyword in Tiny Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q66104/
---

## Q66104: Use of _far Keyword in Tiny Programs

	Article: Q66104
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 17-DEC-1990
	
	A tiny memory model program cannot have _far code. The following
	documentation taken from online help is incorrect because it is not
	possible to use the _far keyword with code addresses or static data
	addresses in a tiny program. It is also not possible to use the _huge
	keyword with static data addresses.
	
	   The tiny-model option creates a program with the .COM extension.
	   The program contains a single segment for both code and data. Code
	   and data combined are limited to 64K.
	
	   Both code and data items are accessed with near addresses. You can
	   override the defaults with the _far keyword for code and the _far
	   or _huge keyword for data.
	
	The _far keyword does override the near addresses correctly, but the
	linker will generate the following error message because a .COM file
	cannot have segment references:
	
	   LINK : fatal error L1127: far segment references not allowed with
	   /TINY
	
	It is possible to use _far and _huge keywords to create pointers for
	use with dynamic memory or to set up pointers with absolute addresses,
	such as a pointer to video memory. This is because these pointers do
	not have segment values that depend on where the program is loaded in
	memory. A .EXE file contains a table of all segment references that
	are made by the program in its header. When the program is loaded, all
	segment values in the table are adjusted for the programs load
	location. Because .COM files do not have this header information, they
	cannot contain segment references.
	
	No Microsoft graphics library routines can be used when generating
	.COM files because they are all compiled as far calls.
