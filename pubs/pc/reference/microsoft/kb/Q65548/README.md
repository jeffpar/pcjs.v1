---
layout: page
title: "Q65548: PDS 7.10 Can Now Buffer COM1 or COM2 Input Data During a SHELL"
permalink: /pubs/pc/reference/microsoft/kb/Q65548/
---

## Q65548: PDS 7.10 Can Now Buffer COM1 or COM2 Input Data During a SHELL

	Article: Q65548
	Version(s): 7.10   | 7.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900904-18 B_QuickBas
	Last Modified: 21-SEP-1990
	
	In most versions of Microsoft BASIC Compiler and QuickBASIC, during a
	SHELL, data coming in through the communications port is not buffered
	and is lost. A new feature of Microsoft BASIC Professional Development
	System (PDS) version 7.10 allows programs compiled with the BC /O
	(stand-alone) option to continue to buffer communications input during
	a SHELL. However, programs that use the run-time module with BASIC PDS
	7.10 still cannot handle COM1 or COM2 input during a SHELL.
	
	This information applies to Microsoft BASIC PDS 7.10 for MS-DOS and MS
	OS/2. The above feature is not available in the following products:
	Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50 for MS-DOS; Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and MS OS/2; and Microsoft BASIC PDS version
	7.00 for MS-DOS and MS OS/2.
	
	This feature is available only when you compile with BC /O. The /O
	compiler switch causes the program to be completely stand alone, which
	means it will run without the run-time module. This feature is not
	available with the run-time module because the run-time module is
	taken out of memory during a SHELL and reloaded when the SHELL is
	exited. Since the code for communications support is contained in the
	run-time module, it is not available during the SHELL. Therefore, the
	program cannot continue to buffer the communications data because the
	code that supports communications has been removed from memory. With a
	stand-alone program, the code for communications support is directly
	linked to the program and stays in memory, thus allowing the program
	to continue to buffer communications data during a SHELL.
