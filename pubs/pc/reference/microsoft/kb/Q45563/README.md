---
layout: page
title: "Q45563: setbuf() Does Not Control Buffering of DOS or Keyboard Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q45563/
---

	Article: Q45563
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 25-JUL-1989
	
	Question:
	
	Why does getchar() still wait for a carriage return even though I used
	setbuf() to unbuffer stdin?
	
	Response:
	
	The function setbuf() affects a stream file buffer like stdin, but has
	no effect on the keyboard or DOS device buffers. The stream I/O
	function getchar() can only read a character from the keyboard buffer
	when the keyboard buffer is flushed by either being filled, by a
	carriage return, or by an interrupt 0x21, function 0xC call.
	
	To read typical characters directly from the keyboard, you can use
	the console I/O function getch(). To read control codes such as
	ALT+Q (echo subsequent output to printer) or ALT+R (pause output), you
	can use the _bios_keybrd() function. Query on the following:
	
	   _bios_keybrd()
	
	The following example demonstrates the difference between using
	getchar() and getch():
	
	#include <stdio.h>
	#include <conio.h>
	
	void main (void)
	{
	   setbuf (stdin, NULL);        /* cause stdin to be unbuffered */
	   if (getchar () != EOF )
	      printf ("getchar() still waits for return key\n");
	   if (getch () != EOF )
	      printf ("getch() does not wait for return key\n");
	}
