---
layout: page
title: "Q39909: _scanf and _cscanf always Echo to the Screen"
permalink: /pubs/pc/reference/microsoft/kb/Q39909/
---

## Q39909: _scanf and _cscanf always Echo to the Screen

	Article: Q39909
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 30-DEC-1988
	
	The following is on Page 177 of the "Microsoft C 5.1 Optimizing
	Compiler Run-Time Library Reference" manual:
	
	   Note:
	   While scanf normally echoes the input character, it will not
	   do so if the last call was to ungetch.
	
	This process does not appear to work correctly. The following code
	sample uses _getch() to get a character from the keyboard, then calls
	_ungetch(ch) to disable echoing to the screen before calling _cscanf.
	The keyboard input echoes to the screen regardless of the call to
	_ungetch. If _cscanf is replaced with _scanf, it still echoes to the
	screen.
	
	The following program calls _ungetch, then echoes the filename to
	the screen when it is read by _scanf; although, according to the
	documentation, it should not echo:
	
	------------------------------------------------------------
	#include <conio.h>
	#include <stdio.h>
	#include <ctype.h>
	
	int result;                   /* return value from _scanf */
	char buff2[20];               /* buffer for filename */
	int ch;                       /* character returned by _getch*/
	
	main()                        /* begin executable code */
	
	{
	ch = getch();                 /* read a keyboard character */
	
	cprintf ("please enter file name");
	ungetch(ch);                  /* call to _ungetch */
	result = scanf("%19s", buff2);                 /* call _scanf */
	printf ("\n Number of correctly matched input"
	       "items =  %d\n", result);          /* print # of input items */
	       }
