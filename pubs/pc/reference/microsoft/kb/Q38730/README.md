---
layout: page
title: "Q38730: Changing Default int to 32 Bits"
permalink: /pubs/pc/reference/microsoft/kb/Q38730/
---

	Article: Q38730
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: END-USER | SR# G881110-6126
	Last Modified: 12-DEC-1988
	
	Question:
	
	I am porting a VERY large C program from another C compiler to OS/2.
	In the other compiler, the type int is defined as being the same as
	long (i.e., 32 bits). In Microsoft C, int is defined as being the same
	as short (i.e., 16 bits).
	
	Is there a compiler switch to change int to long rather than short?
	
	Response:
	
	There's no compiler switch that changes the default int to long rather
	than short. If you included a "typedef long int;" or a "#define int
	long" in each and every module you compiled, you would take care of
	some of the problems. However, redefining the identifier "int" is
	likely to cause you severe and difficult-to-find problems. We
	emphatically do NOT recommend it.
	
	Note: K & R and ANSI are both very clear that int could be any size,
	provided that it's at least 16 bits. It is bad coding practice to rely
	on 32-bit ints because it makes porting code difficult.
	
	Changing all int variables to long causes your program to run very
	slowly because whenever it does arithmetic, it will have to do slower
	32-bit arithmetic rather than the more efficient built-in 16-bit
	arithmetic. This situation is true even on 80386 processors because
	current versions of our compilers do not support the generation of
	code that takes advantage of the 80386's 32-bit registers.
	
	A far better strategy is to change only the variables that need to be
	long to long. This way, you will avoid a lot of unintended side
	effects and you will not do more 32-bit arithmetic than is necessary.
