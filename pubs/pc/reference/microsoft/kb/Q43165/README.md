---
layout: page
title: "Q43165: LINK: Creating and Accessing _edata and _end"
permalink: /pubs/pc/reference/microsoft/kb/Q43165/
---

	Article: Q43165
	Product: Microsoft C
	Version(s): 3.X 4.06 | 5.01.20 5.01.21
	Operating System: MS-DOS   | OS/2
	Flags: ENDUSER | s_c
	Last Modified: 6-APR-1989
	
	LINK creates the two symbols _edata and _end when the LINK option
	/DOSSEG is used. If a program is compiled by a Microsoft high-level
	language compiler, or if an assembly program written in Microsoft MASM
	uses .DOSSEG directive, LINK uses this option automatically.
	
	LINK gives _edata the address of the beginning of BSS segment and
	gives _end the address of the end of BSS segment. Since the STACK
	segment is directly above the BSS segment, the address of _end also
	marks the lowest address of the STACK segment.
	
	To obtain the addresses for these two symbols, declare the following
	in your C program:
	
	unsigned char edata, end ;
	
	The addresses, &edata and &end, can now be used to locate _BSS and
	STACK. They can also be examined in CodeView. Modifying these two
	variables is not recommended.
	
	Note: The segment BSS referred to in this article actually includes
	the segment C_COMMON. However in a map file created by LINK, BSS and
	C_COMMON are listed as two separate segments.
