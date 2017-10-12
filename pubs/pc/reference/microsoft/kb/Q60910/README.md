---
layout: page
title: "Q60910: _ERESNOCOLOR Should Be Typed M/G, Not M/T"
permalink: /pubs/pc/reference/microsoft/kb/Q60910/
---

	Article: Q60910
	Product: Microsoft C
	Version(s): 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc docerr
	Last Modified: 1-MAY-1990
	
	On Page 680 of the "Microsoft C Run-Time Library Reference" (published
	by Microsoft Press) for C version 6.00 and on Page 539 of the
	"Microsoft C 5.1 Optimizing Compiler Run-Time Library Reference,"
	_ERESNOCOLOR is incorrectly listed as type M/T, indicating that this
	mode only supports monochrome text. _ERESNOCOLOR should be typed M/G,
	indicating monochrome graphics. The following code demonstrates that
	graphics can be generated when the video mode is set to _ERESNOCOLOR:
	
	Code Example
	------------
	
	 #include <graph.h>
	 #include <conio.h>
	
	 void main(void)
	 {
	  _setvideomode(_ERESNOCOLOR);
	  _ellipse(_GFILLINTERIOR, 80, 50, 240, 150);
	  getch();
	  _setvideomode(_DEFAULTMODE);
	 }
