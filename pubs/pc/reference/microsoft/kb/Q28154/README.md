---
layout: page
title: "Q28154: A RETURN Without a GOSUB in a Subprogram Hangs in EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q28154/
---

## Q28154: A RETURN Without a GOSUB in a Subprogram Hangs in EXE

	Article: Q28154
	Version(s): 6.00    | 6.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	Executing a RETURN statement without a corresponding GOSUB in a
	subprogram hangs an EXE program when compiled without the BC /D
	option. You must compile with the BC /D option (or compile in the
	QuickBASIC environment) to trap a "RETURN without GOSUB" programming
	error (just as you must use BC /D to trap array bounds violations).
	
	This information applies to BC.EXE in Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS and MS OS/2, to BC.EXE in Microsoft
	BASIC Professional Development System (PDS) version 7.00 for MS-DOS
	and MS OS/2, and to BC.EXE in QuickBASIC versions 4.00, 4.00b, and
	4.50 for MS-DOS.
	
	Compile the test program below with BC.EXE and then link it. If you
	compile with the BC /D option, the program gives run-time error,
	"RETURN without GOSUB." If you don't compile with /D, the program
	hangs the computer at run time without telling you about your
	programming mistake.
	
	To avoid hanging due to a programming error like this, use the QB.EXE
	or QBX.EXE environment as a debugger, since the interpreter
	environment correctly traps the "Return without GOSUB" error. The
	program should be modified to remove the "Return without GOSUB"
	programming error.
	
	Code Example
	------------
	
	' test.bas
	   defint a-z
	   declare sub atest ( x )
	
	     i = 1
	     print i
	     call atest (i)
	     print i
	   end
	
	   sub atest ( j )
	      print j
	      j = 2
	      print j
	      return
	   end sub
