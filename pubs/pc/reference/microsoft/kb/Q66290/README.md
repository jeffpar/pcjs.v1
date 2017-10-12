---
layout: page
title: "Q66290: Reference to _pgmptr in CRTEXE.OBJ Is Invalid"
permalink: /pubs/pc/reference/microsoft/kb/Q66290/
---

	Article: Q66290
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	Problem:
	
	My program uses _pgmptr to find the pathname of the executable
	program. When I change my Build Options to "PM multithreaded EXE
	with runtime in DLL," _pgmptr contains all zeros.
	
	Response:
	
	This problem stems from the fact that while _pgmptr exists in
	CDLLOBJS.DLL, there is no reference to _pgmptr in CDLLOBJS.DEF and
	there is an invalid reference to it in CRTEXE.OBJ. Because of this,
	you are unable to access it from your program. The first problem is
	easily corrected by adding _pgmptr to the .DEF file. The second is not
	possible to correct because Microsoft does not release the source code
	to CRTEXE.OBJ.
	
	Workaround
	----------
	
	However, there is a workaround if a DLL is used to access _pgmptr.
	Fortunately the .OBJ file that links the start-up code into the DLL
	does have the correct code to perform the function. The following code
	fragment is an example of how this is done:
	
	Code Example
	------------
	
	In your main application, prototype a function to take the place of
	_pgmptr. For instance:
	
	char *DLLpgmptr(void);          // returns _pgmptr from DLL
	
	The function itself will be defined as follows:
	
	/* foo.c */
	
	extern char *_pgmptr;
	char *_export _loadds DLLpgmptr(void);
	
	char *_export _loadds DLLpgmptr(void)
	{
	        return(_pgmptr);
	}
	
	There is also a required .DEF file that may be defined as follows:
	
	; foo.def
	
	LIBRARY FOO INITINSTANCE
	PROTMODE
	DESCRIPTION    '_pgmptr replacement  function'
	HEAPSIZE  8192
	STACKSIZE 2048
	DATA MULTIPLE
	
	The compile line to make this into a DLL is as follows:
	
	cl /c /MD /Gs /W4 foo.c
	
	The link line is as follows:
	
	link crtdll foo.obj, foo.dll ceexample os2, foo.def;
	implib foo.lib f.dll
	
	Move the resulting DLL to your LIBPATH and call DLLpgmptr() wherever
	you would normally use _pgmptr, and link the library that results from
	running IMPLIB into the final .EXE.
