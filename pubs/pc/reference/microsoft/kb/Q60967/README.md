---
layout: page
title: "Q60967: Dynamic Arrays, Far Strings Overwrite COMMAND.COM"
permalink: /pubs/pc/reference/microsoft/kb/Q60967/
---

## Q60967: Dynamic Arrays, Far Strings Overwrite COMMAND.COM

	Article: Q60967
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900228-4 B_BasicCom
	Last Modified: 14-MAY-1990
	
	If the far heap is used for any reason during the execution of a BASIC
	program, the transient part of COMMAND.COM may have to be reloaded
	after its execution. COMMAND.COM occupies an area of the far heap that
	some features of Microsoft's BASIC compilers use. If COMMAND.COM does
	need to be reloaded and cannot be found in the current path, the
	system prompts you to insert a disk containing it.
	
	This information applies to Microsoft QuickBASIC Compiler versions
	4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler versions 6.00 and
	6.00b, and to Microsoft BASIC Professional Development System (PDS)
	version 7.00.
	
	Page 14 of "Advanced MS-DOS Programming, Second Edition" by Ray Duncan
	(Microsoft Press, 1988) explains this behavior of COMMAND.COM, which
	applies not only to BASIC, but all applications:
	
	   When an application program terminates, the resident portion of
	   COMMAND.COM does a checksum of the transient module to determine
	   whether it has been destroyed and fetches a fresh copy from the
	   disk if necessary.
	
	Many features of Microsoft's BASIC compilers require use of the far
	heap, and thus are common destroyers of COMMAND.COM. The most common
	is when an executable file uses a run-time module, BRUN45.EXE for
	example. Another is the use of dynamic arrays, which are stored in the
	far heap, although using small enough arrays will not overwrite
	COMMAND.COM. In BASIC PDS 7.00, the far strings option (/Fs) also uses
	the far heap, even if no strings are used in the program.
	
	Consider this sample program:
	
	   'NOCODE.BAS
	   'This program contains no code
	
	If NOCODE.BAS is compiled without the /o switch (specifying use of the
	run-time library) or compiled with the /Fs switch under BASIC PDS
	7.00, COMMAND.COM has to be reloaded after execution, even though no
	code or data is actually present.
	
	Consider another example:
	
	   'HUGEARAY.BAS
	   REM $DYNAMIC
	   DIM Array(1 TO 200, 1 TO 200) AS INTEGER
	
	Since HUGEARAY.BAS dimensions a huge, dynamic array, it  overwrites
	COMMAND.COM. If the array were much smaller, COMMAND.COM would remain
	intact. Note that even larger dynamic arrays that aren't huge (over
	64K) can cause COMMAND.COM to be overwritten.
