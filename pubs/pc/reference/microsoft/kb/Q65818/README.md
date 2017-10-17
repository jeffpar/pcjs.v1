---
layout: page
title: "Q65818: Inline Assembly Incorrectly Accesses Far Labels"
permalink: /pubs/pc/reference/microsoft/kb/Q65818/
---

## Q65818: Inline Assembly Incorrectly Accesses Far Labels

	Article: Q65818
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 24-OCT-1990
	
	The following inline assembly code produces a NULL pointer assignment
	when compiled with the compact or large memory models. The code should
	store the ss:sp in the huge pointer tsrstack. However, the code
	generated assumes that the variables will be in the segment referenced
	by the DS register. This is not a correct assumption for a compact or
	large memory model program. Thus, the values are moved into DGROUP
	causing the R6001 NULL pointer assignment message.
	
	This is NOT a compiler error. With inline assembly, the compiler makes
	no changes to the code. Therefore, there is no segment override added
	to the code to allow for tsrstack residing in another segment (in this
	case FAR_DATA). It is the developer's responsibility to make sure that
	the correct code is used for each memory model.
	
	Sample Code
	-----------
	
	char _huge * tsrstack;
	void main (void)
	{
	   _asm MOV WORD PTR tsrstack[0], sp
	   _asm MOV WORD PTR tsrstack[2], ss
	}
	
	This program was extracted from the larger example program ALARM.C,
	which is accessible through online help.
