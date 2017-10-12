---
layout: page
title: "Q38189: SDK C Documentation Incorrect for memcpy"
permalink: /pubs/pc/reference/microsoft/kb/Q38189/
---

	Article: Q38189
	Product: Microsoft C
	Version(s): 4.50   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 18-NOV-1988
	
	Page 339 of the "Microsoft Operating System/2 Software Development
	Kit/ Microsoft C Optimizing Compiler Run-Time Library Reference"
	incorrectly states that the memcpy function ensures proper copying of
	source bytes to the destination if both regions overlap. Microsoft C
	Optimizing Compiler Versions 4.50 or later do not guarantee that
	source bytes in the overlapping area are copied before being
	overwritten.
	
	The memcpy function in Version 4.00 of the Microsoft C compiler
	ensures that copying worked for overlapping regions. Starting with the
	Microsoft C Compiler Version 4.50, this was no longer true. The OS/2
	SDK was first released with C Version 4.50 without the new Microsoft C
	run-time library reference documentation. When the OS/2 SDK package
	was updated to C Versions 5.00 and 5.10, the old Microsoft C run-time
	library reference was not updated. The separate retail packages of the
	Microsoft C Optimizing Compiler Versions 5.00 and 5.10 has the new C
	run-time library reference.
	
	The change was made because ANSI requires that the memmove function,
	not the memcpy function, be used to copy overlapping regions. Because
	no memmove function exists in the Microsoft C Compiler Version 4.00,
	and Microsoft follows ANSI standards, the function memcpy included
	overlapping checking. The added memmove function in C Version 5.00
	prompted the change in the memcpy function. The memmove was added to
	handle overlapping regions while memcpy (the old handler of overlapped
	regions) was implemented as the "fast" copy.
