---
layout: page
title: "Q37664: EMULATOR_TEXT and EMULATOR_DATA Segments in Small Model"
permalink: /pubs/pc/reference/microsoft/kb/Q37664/
---

## Q37664: EMULATOR_TEXT and EMULATOR_DATA Segments in Small Model

	Article: Q37664
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 8-NOV-1988
	
	Small-model C programs compiled with the floating-point emulator
	library (/FPi or /FPc option) may produce two segments of code and
	data each. If there are floating-point operations in your program, the
	compiler will generate these extra segments. The map file shows these
	segments as EMULATOR_TEXT and EMULATOR_DATA.
	
	EMULATOR_TEXT is the code segment for the emulator. In some cases,
	small-model programs can have two code segments. Because the code in
	the emulator only is accessed through far calls and interrupts, this
	is not a problem. Both EMULATOR_TEXT and EMULATOR_DATA are in separate
	segments from DGROUP and _TEXT in all memory models.
