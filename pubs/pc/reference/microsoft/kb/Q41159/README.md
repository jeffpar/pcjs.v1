---
layout: page
title: "Q41159: rewind(stdin) Clears Keyboard Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q41159/
---

	Article: Q41159
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	Problem:
	
	I am trying to clear the keyboard buffer. It seems that using the
	function "fflush" on stream "stdin" does not have any effect.
	
	Response :
	
	The function "fflush" clears the buffers that C programs use for
	stream level I/O. It doesn't clear the device buffer.
	
	To clear the keyboard buffer, use the function "rewind" with the
	stream "stdin", which is associated with the keyboard by default.
	The function is prototyped in "stdio.h".
	
	The following is an example to demonstrate the usage:
	
	#include <stdio.h>
	void main(void)
	{
	int ch ;
	
	ch = getchar() ;    /* input more than one character
	                    ** to see the effect of rewind(stdin) */
	putchar(ch) ;
	putchar('\n') ;
	
	rewind(stdin) ;
	ch = getchar() ;    /* will wait for new input even the first input
	                    ** has more than one character */
	putchar(ch) ;
	}
