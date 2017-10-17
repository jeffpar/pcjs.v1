---
layout: page
title: "Q66774: _wrapon() Function Will Prevent Text Windows From Scrolling"
permalink: /pubs/pc/reference/microsoft/kb/Q66774/
---

## Q66774: _wrapon() Function Will Prevent Text Windows From Scrolling

	Article: Q66774
	Version(s): 5.10 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 9-NOV-1990
	
	A text window filled with characters will normally scroll when a
	character is placed into the last position in the lower-right corner
	of the window. You can use the _wrapon() function to prevent the
	window text from scrolling while still allowing a character to be
	placed in the last position.
	
	Functions, such as _outtext(), are designed such that the current
	cursor location is one character PAST the last output position. Thus,
	when the cursor is turned on, it blinks just past the most recently
	written character.
	
	Note, This assumes that you are using text mode. In graphics mode [or
	with _outgtext()], this is not a problem.
	
	In the case where text wrap is enabled and a character is written to
	the last position of a line, the cursor must blink on the first
	position of the next line. On the last line of a window, this will
	will cause a scroll. The workaround for situations such as this is to
	turn off text wrap while drawing the last character, which is why
	_wrapon() is provided.
	
	The _wrapon() function accepts either of two parameters: _GWRAPON or
	_GWRAPOFF. _GWRAPOFF is the parameter that is needed in this case. The
	sample code below demonstrates this problem and the use of _wrapon()
	to correct it.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <ctype.h>
	#include <stdlib.h>
	#include <graph.h>
	#include <conio.h>
	#include <string.h>
	
	void main(void)
	{
	   int i, response;
	   char ch[11];
	
	   _clearscreen( _GCLEARSCREEN );
	   printf("\n\nDo you want text wrap on? (y/n)");
	   response = getch();
	   if ( _toupper(response) == 'Y' )
	      _wrapon( _GWRAPON );
	   else
	      _wrapon( _GWRAPOFF );
	
	   // Label screen grid for easy reference
	
	   _clearscreen( _GCLEARSCREEN );
	   _outtext( "123456789" );
	   for( i = 2; i <= 9; i++ )
	   {
	      _settextposition( i, 1 );
	      _outtext( itoa( i, ch, 10 ) );
	   }
	
	   // Set a text window and fill all but last line
	
	   _settextwindow( 3, 3, 9, 9 );
	   for( i = 1; i <= 6; i++ )
	   {
	      _settextposition( i, 1 );
	      memset( ch, i+'0', 10 );
	      _outmem( ch, 7 );
	   }
	
	   // Fill last line, all but last character
	
	   _settextposition( i, 1 );
	   memset( ch, i + '0', 10 );
	   _outmem( ch, 6 );
	   getch();
	
	   // Fill last character in window -- the entire window will scroll
	   //   if text wrap was specified
	
	   _outmem( ch, 1 );
	   getch();
	   _clearscreen( _GCLEARSCREEN );
	}
	
	Note: This program utilizes the _outmem() function, which did not
	exist in the C version 5.10 or QuickC 2.00 libraries. To build this
	program with either of these compilers, the program must be rewritten
	without the _outmem() function.
