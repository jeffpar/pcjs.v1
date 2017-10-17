---
layout: page
title: "Q29826: C 5.10 MTDYNA.DOC File: Single-Thread Dynamic-Link Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q29826/
---

## Q29826: C 5.10 MTDYNA.DOC File: Single-Thread Dynamic-Link Libraries

	Article: Q29826
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-AUG-1989
	
	The following information is from "Section 5: Creating Dynamic-Link
	Libraries" of the Microsoft C Version 5.10 MTDYNA.DOC file.
	
	5.1   Single-Thread Dynamic-Link Libraries
	   The OS/2 support library, LLIBCDLL.LIB, is a large-model,
	single-thread  C run-time library for creating dynamic-link
	libraries. This support library is statically linked and uses only the
	alternate math library.
	   To make the dynamic-link library independent of the program that
	calls it, the dynamic-link library must preserve the floating-point
	state and the status of the 80286 CPU registers. This is not possible
	with the emulator floating-point library, since it takes over the 287
	chip. However, math done with the alternate math library is done
	entirely with the 80286 registers. Since the status of the registers
	is preserved, the alternate math package fits the requirement for the
	single-thread dynamic-link library.
	   The LLIBCDLL.LIB C OS/2 support library is not reentrant, and so
	only one thread per process may be executing in it. When creating a
	single-thread dynamic-link library, you should ensure that only one
	thread per process is ever executing in the C run-time library.
	   A dynamic-link library written with LLIBCDLL.LIB can handle
	multiple threads within a process only by explicit serialization using
	semaphores or some similar mechanism to ensure that only one thread
	per process is executing in the C run-time library. In all cases the C
	run-time initialization code must be executed at program startup. This
	is normally done through the per-process automatic initialization
	mechanism provided to OS/2 dynamic-link libraries.
	   Dynamic-link libraries created with this library must be linked
	with LLIBCDLL.LIB and DOSCALLS.LIB only. No other libraries should be
	used when linking.
	   NOTE: This restriction on library use means that the compiler
	option /Lp must not be used with LLIBCDLL.LIB. If you are building
	objects for use with LLIBCDLL.LIB, you should use compiler option /Zl
	to suppress default-library search records in the object file. If
	not, you then MUST link with /NOD so that you do not get a default
	library (such as SLIBCE.LIB) linked in as well.
	   This model uses the C register convention where AX, BX, CX, DX and
	ES are scratch registers. The direction flag is always assumed to be
	cleared ("up").
	   The signal function is supported only for the SIGFPE signal. This
	floating-point exception is not a true signal, but is more like an
	exception.
	   The DosSetSigHandler OS/2 API call should only be used with great
	caution since it can "steal" signals from the user program thereby
	causing problems in this environment.
	
	Editor's Note: The information above applies to single-thread DLL's
	linked with LLIBCDLL.LIB only. Multi-thread .EXE's built with
	LLIBCMT.LIB, or multi-thread DLL's that dynamically link to CRTLIB.DLL
	use emulator math only, and will use a coprocessor if it is present.
