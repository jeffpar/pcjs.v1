---
layout: page
title: "Q57923: QuickC 2.00 Routines Using malloc() Fail in QB Quick Library"
permalink: /pubs/pc/reference/microsoft/kb/Q57923/
---

## Q57923: QuickC 2.00 Routines Using malloc() Fail in QB Quick Library

	Article: Q57923
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 S_QuickC B_BasicCom SR# S900118-96
	Last Modified: 8-FEB-1990
	
	Microsoft QuickC Version 2.00 routines that attempt memory allocation
	[with malloc()] do not allocate any memory when used in a Quick
	library in the QuickBASIC environment. If the pointers are then
	referenced in the C routine, the following error message halts the
	program and returns to DOS:
	
	   run-time error R6013 - illegal far pointer use
	
	Microsoft has confirmed this to be a problem in Microsoft QuickC
	Version 2.00 (buglist2.00), in the QB.EXE editor in Microsoft
	QuickBASIC Version 4.50, and in the QBX.EXE (QuickBASIC Extended)
	editor in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 (buglist7.00). We are researching this problem and will
	post new information here as it becomes available.
	
	C routines that use malloc() to allocate memory work correctly when
	linked with compiled BASIC programs. Furthermore, these routines work
	correctly in Quick libraries when compiled with C Compiler Version
	5.00 and 5.10.
	
	The following code example causes the above error (R6013) in the
	QuickBASIC environment. The code is the SETMEM example from the
	QuickBASIC QB Advisor online Help system, with one line added to
	reference the pointer.
	
	Code Example
	------------
	
	The example below uses the SETMEM function to free memory for a C
	function that uses the C routine malloc() to get dynamic memory.
	
	Note: To run this program, you must separately compile the C function
	and put it in a Quick library. The C function must be compiled using
	the large memory model, so calls to malloc() use the far space freed
	by the BASIC program.
	
	   DECLARE SUB CFunc CDECL (BYVAL X AS INTEGER)
	'Decrease the size of the far heap so CFunc can use malloc
	'to get dynamic memory:
	   BeforeCall = SETMEM(-2048)
	'Call the C function:
	   CFunc (1024)
	'Return the memory to the far heap; use a larger value so
	'all space goes back into the heap.
	   AfterCall = SETMEM(3500)
	   IF AfterCall <= BeforeCall THEN PRINT "Memory not reallocated."
	   END
	
	/* Filename: Setmemc.c,  C Function */
	void far cfunc(bytes)
	int bytes;
	{
	   char *malloc();
	   char *workspace;
	
	   /* Allocate working memory using amount BASIC freed. */
	   workspace=malloc((unsigned) bytes);
	
	   /* Working space would be used here. */
	   *workspace='X';    // Added line to reference ptr/cause error
	
	   /* Free memory before returning to BASIC. */
	   free(workspace);
	}
	
	The following are the QuickC and C compiler compiling lines for the
	above C code:
	
	   QCL -c -AL setmemc.c ;
	   CL -c -AL setmemc.c ;
	
	To create a Quick library from the C routine, the link line is as
	follows:
	
	   LINK /Q /NOE setmem.c,,,bqlb45.lib;
