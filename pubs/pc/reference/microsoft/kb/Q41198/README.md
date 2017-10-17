---
layout: page
title: "Q41198: How ungetch() Works with getch() and getche()"
permalink: /pubs/pc/reference/microsoft/kb/Q41198/
---

## Q41198: How ungetch() Works with getch() and getche()

	Article: Q41198
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	The Microsoft C run-time function ungetch() pushes back a character
	to be read in by the next call to getch() or getche().
	
	The character is pushed back to a special memory buffer defined in
	getch(). The function getch() or getche() checks the special buffer
	before it calls the DOS interrupt function to read input from the real
	keyboard buffer. If the special buffer is not empty, it returns the
	value in the buffer without calling the interrupt 21h function.
	
	ungetch() does not put the character back to the keyboard buffer.
	
	Pushing a character back to the keyboard buffer can be done on some
	machines by calling BIOS keyboard service, interrupt 16H function 05H
	with scan code in the register CH and the character's ASCII code in
	the register CL.
	
	Note: This BIOS function does not exist on many machines -- be sure to
	check the machine you're running on before you try to use this
	function.
