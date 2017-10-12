---
layout: page
title: "Q68874: Using ANSI.SYS Escape Codes with printf() for Screen Control"
permalink: /pubs/pc/reference/microsoft/kb/Q68874/
---

	Article: Q68874
	Product: Microsoft C
	Version(s): 3.x 4.x 5.x 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS                 | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	The DOS ANSI.SYS driver may be used to perform screen control
	functions in printf() output. Setting screen attributes, positioning
	the cursor to a row and column, and clearing the screen are some
	examples of functions that may be done with this driver using the
	correct escape sequences.
	
	The ANSI.SYS driver must be loaded from CONFIG.SYS in order for these
	functions to work correctly. All of the sequences start with the
	escape code "\33" (representing the value for escape in octal),
	followed by the appropriate set of characters needed to perform the
	desired function.
	
	This topic is discussed in detail on pages 224-225 in the Microsoft
	Press book "Variations in C."
	
	The following sample code demonstrates some of these functions:
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main( void)
	{
	   int row = 10;
	   int col = 20;
	   int num = 1;
	
	   printf( "\33[2J");                // clears the screen
	
	   printf( "\33[%d;%dH", row, col);  // positions the cursor at row 10,
	                                     // column 20
	
	   printf( "\33[%dA", num);          // moves the cursor up 1 line
	
	   printf( "\33[%dB", num);          // moves the cursor down 1 line
	
	   printf( "\33[7m");                // sets the attribute to reverse
	                                     // video
	}
	
	There are other sequences available. Information about them may be
	found in DOS manuals under the "prompt" command, or any other sections
	dealing with ANSI.SYS.
	
	Under OS/2, the ANSI driver is enabled by default for all sessions
	except the Presentation Manager. To enable ANSI support in the DOS
	box, a line must be added to the CONFIG.SYS file. See your OS/2
	documentation for more information on the exact syntax.
