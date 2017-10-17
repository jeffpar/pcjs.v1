---
layout: page
title: "Q64424: LINK &quot;Stack Plus Data Exceed 64K&quot;; 7.00 BC /Fs Forces /S"
permalink: /pubs/pc/reference/microsoft/kb/Q64424/
---

## Q64424: LINK &quot;Stack Plus Data Exceed 64K&quot;; 7.00 BC /Fs Forces /S

	Article: Q64424
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 6-AUG-1990
	
	In Microsoft BASIC Professional Development System (PDS) version 7.00
	for MS-DOS and MS OS/2, the BC /Fs (Far Strings) option forces the
	compiler to also perform a /S. If you use many quoted strings in your
	program, this BC /S option places extra overhead in the .OBJ file
	that could (in some cases) overload the linker and give a "Stack plus
	data exceed 64K" error (L2041) at LINK time. Compiling without /Fs
	(using near strings) will not force /S, and the program may then LINK
	without the L2041 error.
	
	BASIC PDS version 7.10 is enhanced so that the BC /Fs option no longer
	forces an automatic /S option. This enhancement can help avoid the
	"Stack plus data exceed 64K" error as in the above case when you need
	to compile with the /Fs option.
	
	BC /S Option
	------------
	
	The BC /S option helps you only at compile time. You only need to use
	the BC /S option when you get an "Out of memory" error message at
	compile time due to too many quoted string constants in the source
	program. Compiling with BC /S increases DGROUP usage at link time, in
	some cases contributing to the cause of the linker error "Stack plus
	data exceed 64K." Compiling with BC /S normally does not affect the
	size or speed of the final linked .EXE program.
	
	BC /Fs Option
	-------------
	
	The BC /Fs (Far Strings) option gives you more space for
	variable-length string variables at the cost of increasing the size
	and slowing the speed of .EXE programs.
