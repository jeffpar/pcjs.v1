---
layout: page
title: "Q36947: _Settexwindow() and Scrolling"
permalink: /pubs/pc/reference/microsoft/kb/Q36947/
---

	Article: Q36947
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 21-DEC-1988
	
	Problem:
	
	The _settextwindow() function specifies a window where the text output
	to the screen is displayed. When the text window is full, the
	uppermost line scrolls up and out of the window. This scrolling occurs
	in most cases, but not all. The _settextwindow function knows to
	scroll the text in the window if the current line being written to is
	the last line in the window and one of either the following situations
	occurs:
	
	1. The string being printed ends with a carriage control
	   character, '\n'.
	
	2. The string wraps onto the next line. (In this case, the
	   wrapping is enabled by a _wrapon(_GWRAPON) call.)
	
	The text in the window will not scroll if these conditions are not
	met. More than likely, the last line in the window will be
	over-written.
	
	This is expected behavior for the _settextwindow and related
	functions.
	
	The examples below assume that the text window is defined by the
	coordinates (1,1, 14,80).
	
	The following example causes the text window to scroll because the
	second _outtext call (which prints to the last line in the window)
	ends in a carriage return character, '\n':
	
	        _settextposition (13,1) ;       /* set cursor to 2nd to    */
	                                        /* last line in the window.*/
	
	        _outtext ("This will appear on line 13\n") ;
	        _outtext ("This will appear on the last line (14)\n") ;
	        _outtext ("The text window has now scrolled.") ;
	
	The following example also scrolls because the text output on the
	final line in the window wraps around to the next line:
	
	        _wrapon (_GWRAPON) ;            /* enable wrapping of text.*/
	        _settextposition (14,1) ;       /* set cursor to last line.*/
	        _outtext ("This will be forty characters in length..") ;
	        _outtext ("This will wrap around the right window border") ;
	
	The example below will not scroll the text window. The second
	_outtext() will just over-write the first. It will not scroll because
	wrapping has been disabled, and there is no carriage control character
	to signal the window to scroll.
	
	The following example demonstrates this behavior:
	
	        _wrapon (_GWRAPOFF) ;           /* disable wrapping of text*/
	        _settextposition (14,1) ;       /* set cursor to last line.*/
	        _outtext ("This will appear on the last line (line 14)...") ;
	        _settextposition (14,1) ;       /* set cursor to last line.*/
	        _outtext ("This will over-write, not scroll.") ;
