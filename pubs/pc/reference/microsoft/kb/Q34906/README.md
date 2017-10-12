---
layout: page
title: "Q34906: Run-Time Library Reference _getfillmask, _setfillmask docerrs"
permalink: /pubs/pc/reference/microsoft/kb/Q34906/
---

	Article: Q34906
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | 5.10
	Flags: ENDUSER | docerr
	Last Modified: 26-AUG-1988
	
	The program examples for _getfillmask and _setfillmask, on Pages
	325-326 and Pages 521-522 of the "Microsoft C 5.1 Optimizing Compiler
	Run-Time Library Reference" have an error. The fill mask array is
	incorrectly initialized. Back slashes are required prior to "x" for
	specifying hexadecimal constants for the char variables of the masks.
	
	The following sample code correctly initializes the char variables:
	
	#include <stdio.h>
	#include <graph.h>
	
	unsigned char *(style[6])={"\x78\x30\x30\x78\x30\x30\x78\x30",
	                           "\x78\x32\x30\x78\x30\x38\x78\x32",
	                           "\x78\x39\x38\x78\x63\x36\x78\x33",
	                           "\x78\x65\x36\x78\x33\x38\x78\x62",
	                           "\x78\x66\x63\x78\x65\x65\x78\x37",
	                           "\x78\x66\x65\x78\x66\x65\x78\x66"};
	
	char *oldstyle = "12345678"; /* place holder for old style */
	
	main()
	{
	 int loop;
	 _setvideomode(_MRES4COLOR);
	 _getfillmask( oldstyle );
	 _setcolor( 2 ); /* draw an ellipse under the */
	 /* middle few rectangles in a different color */
	 _ellipse( _GFILLINTERIOR, 120, 75, 200, 125 );
	 _setcolor( 3 );
	 for ( loop = 0; loop < 6; loop++ ) {
	 /* make 6 rectangles, the first background color */
	 _setfillmask( (char far *)(style[ loop ]) );
	 _rectangle(_GFILLINTERIOR,loop*40+5,90,(loop+1)*40,110);
	 }
	 _setfillmask( oldstyle ); /* restore old style */
	 while ( !kbhit() ); /* Strike any key to continue */
	 _setvideomode (_DEFAULTMODE);
	}
