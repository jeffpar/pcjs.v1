---
layout: page
title: "Q43393: No Explicit Limit on Length of Literal Strings In QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q43393/
---

	Article: Q43393
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_c
	Last Modified: 12-NOV-1990
	
	A string literal more than 512 characters long will compile, link, and
	execute correctly with the Microsoft QuickC Compiler, Version 2.00.
	However, the Microsoft C Optimizing Compiler, Version 5.10, gives the
	following error message:
	
	   filename.c(line #) : warning C4009 : string too big, trailing chars
	                        truncated
	
	This is expected behavior. The maximum length of a string literal
	under C 5.10 is 512 bytes, including the terminating null character.
	This is documented on Page 280 of the "Microsoft C 5.10 Optimizing
	Compiler User's Guide". In C 6.00, this limit was increased to 2048
	bytes. Lastly, in QuickC 2.00 and 2.50 there is no explicit limit on
	the length of string literals. This is documented on Page 266 of the
	"Microsoft QuickC 2.00 Compiler Toolkit" manual.
	
	The limit on the size of a string literal under QuickC 2.00 is
	dependent on available memory. When there is not enough space, the
	compiler gives the following error message:
	
	   filename.c(line #) : fatal error C1059 : out of near heap space
	
	This means that the compiler ran out of room in the near heap for
	storing the string literal. In this case, store the string literal in
	a file and read it into a character array at run time.
