---
layout: page
title: "Q47502: QuickC Can Dimension Arrays Only Up to 0xFFFF Bytes"
permalink: /pubs/pc/reference/microsoft/kb/Q47502/
---

	Article: Q47502
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 10-OCT-1989
	
	Problem:
	
	When compiled with QuickC 2.00, the second line of the following code
	generates the error "C2125: too_big : allocation exceeds 64K." The
	same code compiles without error under C 5.10.
	
	   char not_big[0x0FFFF];
	   char too_big[0x10000];
	
	In compact or large model, the definition of too_big should be legal.
	Although too_big is being defined as 0x10000 bytes, the indices for
	the array goes only from 1 to 0xFFFF, which is a single segment. The
	following array definition results in the same error:
	
	   char still_too_big[0x100][0x100];
	
	Again, this should be legal since the space taken by the array is a
	single segment.
	
	Response:
	
	This problem is caused by a limitation of the QuickC compiler and the
	way in which it stores information concerning arrays. The upper limit
	of an array is stored in a single word, which can hold only values up
	to 0xFFFF. The upper limit of the arrays shown above are 0x10000;
	thus, they do not fit in the word used by QuickC 2.00 and are
	tagged with C2125.
	
	A workaround of the limitation would be to declare a pointer to the
	required type, and then allocate space for it with either halloc or
	_dos_allocmem.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
