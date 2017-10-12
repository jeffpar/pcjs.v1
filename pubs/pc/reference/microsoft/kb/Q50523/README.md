---
layout: page
title: "Q50523: Floating-Point Initialization Occurs at Link Time"
permalink: /pubs/pc/reference/microsoft/kb/Q50523/
---

	Article: Q50523
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 21-MAR-1990
	
	Floating-point initialization occurs at link time. If the compiler has
	generated any floating-point instructions, it lists an external
	symbol. When the linker sees the external symbol, it brings in the
	necessary segment.
	
	In C 5.10, the external symbol is __fltused. The linker brings in a
	module that has a common CDATA segment that defines the correct values
	of fpmath, fpdata, and fpsignal. If this module is not brought in, the
	CDATA segment defaults to all zeros. This is why CDATA is defined as
	common and not public.
	
	This process causes the floating-point support to be linked only if
	floating point is used.
