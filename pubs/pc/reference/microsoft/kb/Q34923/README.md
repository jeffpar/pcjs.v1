---
layout: page
title: "Q34923: Corrections to the _setbkcolor Example"
permalink: /pubs/pc/reference/microsoft/kb/Q34923/
---

	Article: Q34923
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	Problem:
	
	The example program on Page 515 of the "Microsoft C 5.0 (and 5.1)
	Optimizing Compiler Run-Time Library Reference" and the "Microsoft
	QuickC Run-Time Library Reference" is supposed to run through 20
	different background colors, displaying the use of _setbkcolor. When I
	try to run the program, my screen flickers and I am returned to the
	DOS prompt.
	
	Response:
	
	The example is incorrect. The following example changes the background
	color in graphics mode (this example can be found on the Libraries 1
	disk of the QuickC Version 1.01 compiler, in PROGRAMS\SBKCOL.C):
	
	#include <stdio.h>
	#include <graph.h>
	
	long color[16] = {_BLACK,_BLUE,_GREEN,_CYAN,_RED,_MAGENTA,
	     _BROWN,_WHITE,_GRAY,_LIGHTBLUE,_LIGHTGREEN,_LIGHTCYAN,
	     _LIGHTRED,_LIGHTMAGENTA,_LIGHTYELLOW,_BRIGHTWHITE};
	
	main()
	{
	 int loop;
	 long i;
	 _setvideomode(_HRES16COLOR);
	 for (loop = 0; loop < 16; loop++ ) {
	 _setbkcolor(color[loop]);
	 for (i=0; i < 50000; i++)     /* null loop */
	    ;
	 _setvideomode (_DEFAULTMODE);
	}
	
	The next example changes the background color in text mode:
	
	#include <stdio.h>
	#include <graph.h>
	
	main()
	{
	  long loop;
	  for (loop = 0; loop < 16; loop++)
	    {
	      _setbkcolor(loop);
	      _outtext("    hello    \n");
	    }
	}
