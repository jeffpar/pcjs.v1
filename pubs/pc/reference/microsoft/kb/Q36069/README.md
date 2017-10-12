---
layout: page
title: "Q36069: Different Results between Alternate and Coprocessor/Emulator Math"
permalink: /pubs/pc/reference/microsoft/kb/Q36069/
---

	Article: Q36069
	Product: Microsoft C
	Version(s): 3.00 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | s_pascal h_fortran h_masm
	Last Modified: 12-OCT-1988
	
	There may be differences between the floating point values you get
	when using coprocessor/emulator math and the alternate math packages.
	
	This behavior applies to C Versions 3.00, 4.00, 5.00, and 5.01, Pascal
	Versions 3.1x, 3.20, 3.30, 3.31, 3.32, and 4.00, FORTRAN Versions
	3.1x, 3.20, 3.30, 3.31, 4.0x, and 4.10, and MASM Versions 1.25, 1.27,
	3.0x, 4.00, 5.00, and 5.10.
	
	When you do any floating point arithmetic with the coprocessor all
	values are pushed onto the coprocessor stack. The coprocessor stack
	only holds 10-byte reals. This means that all real*4 and/or real*8
	(real/double) are expanded to 10-byte reals, then all of the
	arithmetic is done on these 10-byte reals. The emulator package does
	this same expansion. The results of floating point calculations are
	then rounded back down to real*4 or real*8 format.
	
	Alternate math calculations are performed using real*4 or real*8
	format which can result in less precision than that available with
	coprocessor/emulator math.
