---
layout: page
title: "Q59088: _setactivepage() and _setvisualpage() May Corrupt Display"
permalink: /pubs/pc/reference/microsoft/kb/Q59088/
---

## Q59088: _setactivepage() and _setvisualpage() May Corrupt Display

	Article: Q59088
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm
	Last Modified: 15-MAR-1990
	
	Interrupting execution of the following code, then attempting to step
	through the program with F10, may cause the mouse to be temporarily
	frozen and the video display to be corrupted. The problem is caused by
	an unresolved swapping between _setactivepage() and _setvisualpage().
	The solution is to either press F4 twice or allow the program to
	terminate normally, thereby resetting the default video mode.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <graph.h>
	
	#define DELAY 1
	
	void main(void)
	{
	   int x=0, y=0, time=DELAY, loop=0, pages;
	   struct videoconfig config;
	
	   _setvideomode(_MRES16COLOR);
	   _getvideoconfig( &config );
	   pages = config.numvideopages;
	
	   while ( !kbhit() )
	   {
	      _setactivepage( loop % pages );
	      _setcolor( loop % 16 );
	      _rectangle( _GFILLINTERIOR, ++x, ++y, x+160, y+100 );
	      _setvisualpage( loop++ % pages );
	      while( time-- );
	      time = DELAY;
	   }
	   _setvideomode (_DEFAULTMODE);
	}
	
	The sequence of events causing the situation to occur is listed below:
	
	1. Open the above source code in QuickC 2.00 or 2.01.
	
	2. GO (using F5 or a mouse click).
	
	3. CTRL+BREAK to interrupt execution in the first few seconds of the
	   run. The Source window appears.
	
	4. Press F10. The cursor may disappear, and the mouse will be locked
	   out.
	
	5. CTRL+BREAK again. The mouse is now active, but the screen display is
	   corrupted. Dragging the mouse around the screen leaves a trail of
	   blocks.
	
	6. Toggle F4 to restore the source window and refresh the screen.
