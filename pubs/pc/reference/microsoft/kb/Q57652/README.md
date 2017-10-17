---
layout: page
title: "Q57652: Example of Older FORTRAN Main to Newer C Procedure Call"
permalink: /pubs/pc/reference/microsoft/kb/Q57652/
---

## Q57652: Example of Older FORTRAN Main to Newer C Procedure Call

	Article: Q57652
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | H_FORTRAN 4.00
	Last Modified: 21-JAN-1990
	
	When you link a mixed-language program, you must specify the newer
	version of the run-time library before the earlier version library on
	the link line, even if the earlier version of the library belongs to
	the main procedure in a mixed-language call.
	
	The following code is an example of a mixed-language program that uses
	a FORTRAN main program to call a C procedure to handle the graphics
	for the program. The code is intended to demonstrate correct compile
	and link switches when a FORTRAN routine is compiled with an earlier
	version of the FORTRAN package, which calls a C routine compiled with
	a newer version of the C package.
	
	The code begins execution in the FORTRAN main, then calls the C
	routine to handle elementary graphics routines. Notice the order of
	libraries specified on the link line.
	
	C*****************  FORMOD.FOR *****************
	C  FORMOD.FOR - FORTRAN 4.0 module to be used with CGRAPH
	
	       INTERFACE TO SUBROUTINE CGRAPH[C, ALIAS:'_cgraph']
	       END
	
	       PROGRAM FORMOD
	       CALL CGRAPH
	       END
	
	/******************  CGRAPH.C *****************    */
	/* CGRAPH.C - C Graphics module. Used with FORMOD. */
	
	#include <stdio.h>
	#include <graph.h>
	#include <conio.h>
	
	void cgraph(void)
	{
	    int i;
	
	    i = _setvideomode(_MRES16COLOR);
	    printf("return = %d", i); /* check for failed return */
	    getch();
	    _setvideomode(_DEFAULTMODE);
	}
	
	# ****************** FORMOD.MAK ***********************
	
	formod.obj: formod.for
	        fl /Od /Zi /c /AL formod.for
	
	cgraph.obj: cgraph.c
	        cl /Od /Zi /W3 /c /AL cgraph.c
	
	formod.exe: cgraph.obj formod.obj
	        link /CO /NOE /NOD
	        formod cgraph,,,llibcer.lib+llibfore.lib+graphics.lib;
	
	Note: The C graphics calls will fail if the earlier libraries (in this
	case, the FORTRAN libraries) are specified first on the link line.
	This is expected, as you always want newer definitions of the repeated
	code linked into your EXE file.
	
	For more information about FORTRAN and C mixed-language programming,
	see the "Mixed-Language Programming Guide" in your compiler
	documentation.
