---
layout: page
title: "Q47037: Using _pgmptr to Get the Full Path of the Executing Program"
permalink: /pubs/pc/reference/microsoft/kb/Q47037/
---

## Q47037: Using _pgmptr to Get the Full Path of the Executing Program

	Article: Q47037
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 8-AUG-1989
	
	Question:
	
	On Page Update-23 of the "Version 5.10 Update" to the Microsoft C 5.10
	Optimizing Compiler, there is a description of the variable _pgmptr.
	The documentation states that _pgmptr points to a string containing
	the full pathname of the invoked program, but does not describe how to
	use it. I can't find _pgmptr in any of the include files. Where is
	_pgmptr declared and how do I use it?
	
	Response:
	
	The variable _pgmptr is not defined in an include file. It is declared
	in CRT0DAT.ASM, which is part of the C start-up code. This code is
	linked in to any module that contains a main() function. To use
	_pgmptr, you must first declare it as an external far character
	pointer, as follows:
	
	   extern char far *_pgmptr;
	
	Since _pgmptr is automatically initialized at start-up to point to the
	full pathname of the executing program, this declaration is all that
	is required to make the full pathname available to your program.
	
	The following program demonstrates the usage of _pgmptr:
	
	#include <stdio.h>
	
	extern char far *_pgmptr;
	
	void main(void)
	{
	  printf ("The full path of the executing program is : %Fs\n", _pgmptr);
	}
	
	In OS/2 real mode or DOS 3.x, argv[0] also contains a pointer to the
	full pathname of the executing program. In OS/2 protected mode,
	argv[0] contains only the information typed at the command line to
	invoke the program. Therefore, in OS/2 protected mode, using _pgmptr
	is the only way to easily access the executing program's full pathname
	string.
