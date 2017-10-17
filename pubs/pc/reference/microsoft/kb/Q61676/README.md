---
layout: page
title: "Q61676: Expanded Memory Emulators Slow Down Floating-Point Operations"
permalink: /pubs/pc/reference/microsoft/kb/Q61676/
---

## Q61676: Expanded Memory Emulators Slow Down Floating-Point Operations

	Article: Q61676
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900426-56 B_BasicCom S_C S_QuickC S_PasCal H_Fortran
	Last Modified: 11-MAY-1990
	
	Floating-point mathematics in Microsoft languages may be slower when
	running with expanded memory emulators. This is a result of the
	expanded memory emulators redirecting interrupts used by the
	floating-point routines.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS, to Microsoft BASIC Professional Development System
	(PDS) version 7.00 for MS-DOS, to Microsoft QuickC versions 2.00 and
	2.01 for MS-DOS, to Microsoft C versions 5.00 and 5.10 for MS-DOS, to
	Microsoft C Professional Development System version 6.00 for MS-DOS,
	to Microsoft Pascal version 4.00, and to Microsoft FORTRAN versions
	4.00 and 4.10 for MS-DOS.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	Expanded memory managers on 80386/80486 systems generally run in a
	virtual 8086 mode that allows them to trap and handle memory access
	requests (this allows them to trap and handle all calls relating to
	expanded memory). When running in virtual 8086 mode, interrupts are
	trapped by the virtual machine manager.
	
	In the case of the interrupts used for floating-point emulation, the
	virtual machine manager does not handle them so it reflects the
	interrupts back to real mode where they are handled by the
	floating-point emulator.
	
	Instead of directly calling the floating-point routines, the processor
	must switch between protected and real modes as well as performing
	checks to see if it should handle the interrupt. This extra processing
	by the virtual machine manager is responsible for the reduced
	performance.
