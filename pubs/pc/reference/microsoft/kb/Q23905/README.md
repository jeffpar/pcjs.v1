---
layout: page
title: "Q23905: Initial Memory Allocation of C Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q23905/
---

	Article: Q23905
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | DGROUP 64K
	Last Modified: 15-JAN-1990
	
	Question:
	
	I want to make a program "terminate and stay resident." It is a very
	short program with only 4K of data and about 2K of code. However, when
	I execute the program to make it resident and do a CHKDSK, it seems to
	occupy about 70K. Why does it take up so much space?
	
	Response:
	
	The linker normally allocates all of memory to a program. You can use
	the /CP switch to adjust the allocation down. If you specify an amount
	less than the minimum allocation, the maximum allocation will default
	to that minimum, so link with /CP:1.
	
	You can also use the /max <MinimumAllocationInHexParagraphs> option of
	the EXEMOD.EXE utility to adjust the maximum allocation of a program.
	
	Microsoft C was not designed for writing memory resident software.
	Although it is possible, you also may need to make modifications to
	the start-up code. Be cautious about what functions you use and what
	DOS functions are called.
