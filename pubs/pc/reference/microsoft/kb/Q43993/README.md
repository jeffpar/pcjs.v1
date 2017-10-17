---
layout: page
title: "Q43993: How to Flush the Keyboard Typeahead Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q43993/
---

## Q43993: How to Flush the Keyboard Typeahead Buffer

	Article: Q43993
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 22-MAY-1989
	
	To flush the BIOS keyboard typeahead buffer, the DOS function 0xC may
	be used. This function clears the keyboard typeahead buffer and then
	invokes a reading function specified in the AL register. The AL
	register can be 0x01, 0x06, 0x07, 0x08, or 0x0A to specify a valid
	reading function. If you do not intend to read after flushing the
	buffer, you may specify an invalid number in AL.
	
	Another method of flushing BIOS's buffer is to call the console I/O
	function getch() until the function kbhit() becomes false. This
	method is demonstrated in the program below and has the advantage of
	being usable under OS/2 as well as DOS.
	
	The buffer implemented by the C run-time functions for the stream
	"stdin" is different from the BIOS keyboard typeahead buffer. To clear
	the buffer for stdin, use the function fflush(). However, this method
	will not flush BIOS's buffer. To be totally flushed, you must both
	flush BIOS's buffer as described above in this article AND call fflush
	for stdin.
	
	The following sample program is provided for demonstration:
	
	// sample program
	#include <stdio.h>
	#include <time.h>
	#include <conio.h>
	#include <dos.h>
	
	void main (void)
	{
	time_t start, work ;
	char str [50] ;
	
	puts ("type for getchar(). Go to stdin's buffer.") ;
	// user can type more than one character and an Enter.
	getchar () ;
	
	puts ("Type fast, 5 seconds. Go to BIOS buffer.") ;
	// user can type anything including multiple Enters.
	time (&start) ;
	work = start ;
	while ( (work - start) < 5 ) time (&work) ;
	
	bdos (0xC, 0, 0) ;       // clear BIOS keyboard buffer
	
	//  Alternative method:
	//  while (kbhit()) getch();
	
	fflush (stdin) ;         // clear stdin's buffer
	puts ("Should be waiting again.") ;
	
	gets (str) ;
	puts (str) ;
	}
