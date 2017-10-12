---
layout: page
title: "Q46217: QuickC Does Not Always Deallocate Memory Given to Video Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q46217/
---

	Article: Q46217
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm
	Last Modified: 18-SEP-1989
	
	When a graphics mode program is run from within the QuickC
	environment, screen swapping is used as the method of screen exchange.
	Thus, a buffer is dynamically allocated for holding the contents of
	the graphics-mode output screen. If the video mode is not reset to a
	text mode at the end of the program [i.e.,
	_setvideomode(_DEFAULTMODE);],  this buffer will not be deallocated
	properly, and the available memory will be decreased accordingly. A
	program that is constructed in this manner will eventually fail due to
	lack of memory, either at start-up or in the body of the code, when an
	attempt is made to allocate memory for use by the program.
	
	The following program demonstrates the problem. If the
	_setvideomode(_DEFAULTMODE); line is uncommented at the end of the
	program, it will run properly inside of the QuickC environment an
	unlimited number of times. However, if the program is allowed to
	terminate without resetting the video mode, it will fail the second,
	third, or fourth try, depending upon the initial amount of free memory
	in the system. This program will run properly from a DOS prompt any
	number of times. Another solution is simply to shell out of QuickC and
	reset the mode to a text mode. The program will then run one more
	time. However, the best solution is to change the program.
	
	Sample Program
	--------------
	
	#include <stddef.h>
	#include <malloc.h>
	#include <process.h>
	#include <graph.h>
	#include <conio.h>
	
	void main (void)
	 { long size;
	   char huge *image;
	
	   /* Put the display in a EGA mode and allocate a buffer. */
	   if (_setvideomode(_ERESCOLOR)==0)
	       { _outtext ("Video mode not supported!\n");
	         exit (0);
	       }
	
	   /* In _VRES16COLOR, size is 153604. */
	   size = _imagesize(0,0,639,349);
	
	   if ( (image=(char huge *)halloc(size,1)) == NULL)
	        {
	         _outtext ("Not enough memory for buffer!\n");
	         exit (1);
	       }
	   /* Draw a couple of shapes and capture the screen. */
	   _ellipse (_GBORDER,0,0,639,349);
	   _rectangle (_GBORDER,0,0,639,349);
	   _getimage (0,0,639,349,image);
	
	   /* Clear the screen and redraw the image. */
	   _clearscreen (_GCLEARSCREEN);
	   _putimage (0,0,image,_GOR);
	   getch();
	   hfree ((char huge *)image);       /* carefully free the image buffer */
	   /* _setvideomode (_DEFAULTMODE); */
	   /* uncomment the line above, and the program works every time */
	}
