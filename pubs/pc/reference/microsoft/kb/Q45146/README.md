---
layout: page
title: "Q45146: Some Coprocessor Instructions Not Emulated"
permalink: /pubs/pc/reference/microsoft/kb/Q45146/
---

## Q45146: Some Coprocessor Instructions Not Emulated

	Article: Q45146
	Version(s): 4.x 5.00 5.10a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 30-AUG-1989
	
	The emulator libraries included with the languages do not support all
	coprocessor instructions. The following error message results from
	unsupported coprocessor instructions:
	
	   run-time error M6107: MATH
	   - floating-point error: unemulated
	
	The following is a list of unemulated coprocessor instructions:
	
	   FBLD   -  (emulated in XENIX 386 but not MS-DOS, OS/2)
	   FBSTP  -  (emulated in XENIX 386 but not MS-DOS, OS/2)
	   FCOS
	   FDECSTP
	   FINCSTP
	   FINIT  -  (emulated in XENIX 386 but not MS-DOS, OS/2)
	   FLDENV -  (emulated in XENIX 386 but not MS-DOS, OS/2)
	   FNOP   -  (emulated in XENIX 386 but not MS-DOS, OS/2)
	   FPREM1
	   FRSTOR
	   FSAVE
	   FSETPM
	   FSIN
	   FSINCOS
	   FSTENV -  (emulated in XENIX 386 but not MS-DOS, OS/2)
	   FUCOM
	   FUCOMP
	   FUCOMPP
	   FXTRACT
	
	Also, some of the No-Wait forms of instructions are not emulated (e.g.
	FNSTENV, FNINIT).
