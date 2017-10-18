---
layout: page
title: "Q35880: Align Directive Aligns Off Start of Segment"
permalink: /pubs/pc/reference/microsoft/kb/Q35880/
---

## Q35880: Align Directive Aligns Off Start of Segment

	Article: Q35880
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The ALIGN directive adds the necessary bytes to pad the current offset
	to be divisible by 16.
	
	In the example below, the offset of the first byte of d1 is 0;
	therefore, the offset of the last is 31. Thus, 1 byte of padding is
	necessary to "align on a paragraph boundary," i.e., make the current
	offset divisible by 16.
	
	The following example demonstrates this information:
	
	e.data
	d1   db 'This is to pad the data segment'
	align 16
