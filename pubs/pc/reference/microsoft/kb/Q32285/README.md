---
layout: page
title: "Q32285: EXEC Problem with the Novell Network"
permalink: /pubs/pc/reference/microsoft/kb/Q32285/
---

	Article: Q32285
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-OCT-1988
	
	When compiling a program under a Novell network, the following
	problems can occur:
	
	1. A command-line error message.
	2. A stack overflow.
	3. The compiler hangs.
	4. Programs created with C Version 4.00 and Link Version 3.51
	   could generate Error 2003 : integer divide by zero.
	
	This is not a problem with the Microsoft C Compiler, nor is it an
	error on your part. A problem exists in the way Novell networking
	software handles the EXEC function, one of the DOS interrupt 21h
	functions used by the CL and MSC programs to start each of the
	compiler passes.
	
	Contact your Novell dealer about this problem; there should be a patch
	available. Novell has stated this problem has been corrected in
	Version 2.10 and later.
	
	Novell's network emulates DOS; the problem arises from incorrect
	emulation of the DOS int 21H function 4BH (EXEC program) call. The
	Novell network assumes the calling program will save SS:SP before the
	call. This was necessary on DOS Versions 2.x, but it is not necessary
	to save the registers on DOS Versions 3.x.
	
	The C compiler checks to see what version of DOS it is running on; if
	you are running DOS Versions 2.x, save SS:SP; if you are running DOS
	Versions 3.x (which is what Novell presents itself as) do not save
	SS:SP. The network destroys those registers on the call even though
	this behavior is unlike DOS Versions 3.x.
