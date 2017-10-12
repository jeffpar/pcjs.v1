---
layout: page
title: "Q44417: CALLTREE Ignores Conditional Compilation Statements in Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q44417/
---

	Article: Q44417
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_C H_MASM
	Last Modified: 17-MAY-1989
	
	The CALLTREE utility provided with the Microsoft Editor can be used to
	produce a graphical call-tree listing of a project. The following
	command line is an example of this utility. This command line creates
	a file called CALLS.TXT showing the relationship of the functions
	found in the four C source files shown below:
	
	   calltree /c calls.txt main.c sub1.c sub2.c sub3.c
	
	If any of the files use conditional compilation directives, these are
	disregarded by CALLTREE and any functions that would not have been
	called appear in the call listing. An example of code that produces a
	misleading call listing is shown below. Although only one set of calls
	is compiled, both sets show up in the file produced by CALLTREE.
	
	    void main( void )
	    {
	    #ifdef DEBUG
	        dshow();
	        ddone();
	    #else
	        fshow();
	        fdone();
	    #endif
	    }
	
	To avoid this situation, a preprocessor listing should be produced
	using the /P switch with CL, and CALLTREE should then be run on the
	resultant file.
	
	This is a limitation of the utility. CALLTREE is meant to be a
	general-purpose tool for C and assembly programs, and is not designed
	to do any parsing or syntax checking.
