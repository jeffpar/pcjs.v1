---
layout: page
title: "Q50950: How and When to Specify Stack Size (Clarification)"
permalink: /pubs/pc/reference/microsoft/kb/Q50950/
---

## Q50950: How and When to Specify Stack Size (Clarification)

	Article: Q50950
	Version(s): 3.65 4.06 4.07 | 5.01.21
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	Question:
	
	When I want to specify a certain stack size for a program, should I
	use the /F compiler option, the /ST linker option, or both?
	
	Response:
	
	This depends on how you are compiling and linking. If you using the CL
	command to compile and link, the /F compiler option is all that is
	necessary. This option will pass the correct size of the stack to the
	linker.
	
	On the other hand, if you are invoking the compiler and the linker
	separately (as in a make file), the /ST link option can be used to get
	the desired stack size. The /ST link option is documented on Page 123
	of the "Microsoft C Optimizing Compiler User's Guide."
	
	No stack information is stored in the object module. Therefore, using
	the /F and /c (compile only) options together and then invoking link
	separately will not generate the desired stack size. The /F compile
	option is documented on Page 102 of the "Microsoft C Optimizing
	Compiler User's Guide."
