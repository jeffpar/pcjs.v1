---
layout: page
title: "Q41203: getch() Misbehaves on Keyboard Inputs ALT+Q, ALT+R"
permalink: /pubs/pc/reference/microsoft/kb/Q41203/
---

	Article: Q41203
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Problem:
	
	The sample program below accepts all the keyboard inputs normally,
	including most of the ALT combination keys. But it appears to behave
	incorrectly on two keyboard inputs: ALT+Q and ALT+R.
	
	Response:
	
	This is not a problem with the Microsoft C Optimizing Compiler
	run-time function getch(). The problem is caused because DOS uses the
	values of these two ALT combination keys for other control purposes.
	
	In this case, the second scancode of ALT+Q is 16 and the second
	scancode of ALT+R is 19 (both decimal). DOS uses scancode 16 to mean
	"echo subsequent output to the printer" and scancode 19 to mean "pause
	output." These are equivalent to CTRL+P and CTRL+S. When a printer is
	not connected to the computer, the PRINT SCREEN key has to wait for
	time out. For the SCREEN PAUSE key, another key has to be pressed to
	activate the screen again.
	
	We recommend using the _bios_keybrd() function rather than getch()
	when you might press ALT+R or ALT+Q.
	
	Usually the ALT combination keys generate 2 bytes in the keyboard
	buffer. The program below checks if the first byte is zero. If it is
	zero the program reads in the next byte, which has the value for that
	particular ALT combination key.
	
	The following is a code example:
	
	/* sample program */
	#include <stdio.h>
	#include <conio.h>
	void main(void)
	{
	    int ch, scan;
	
	    do {
	        ch = getch();    /* 1st getch() gets ASCII code */
	        printf("Character is %d\n", ch);
	        if (ch == 0) {    /* if ASCII code was zero */
	            scan = getch();  /* 2nd getch() gets "scan code" */
	            printf("\tExtended character:  scan is %d\n", scan);
	        }
	    }  while (ch != 27);    /* exit loop on ESC */
	}
	
	To read the combination keys successfully, use the function
	_bios_keybrd(). The following is an example that works in a similar
	manner to the example above. Note: Because _bios_keybrd() returns
	both the scan code and the ASCII value in the high and low bytes of
	the return value, only one call to _bios_keybrd() is necessary for
	each keystroke.
	
	The following is a code example:
	
	#include <stdio.h>
	#include <bios.h>
	
	void main(void)
	{
	unsigned scan_asc;
	int ch, scan;
	
	    do {
	        scan_asc = _bios_keybrd(_KEYBRD_READ);
	        ch = scan_asc & 0xff;  /* character in low byte */
	        scan = scan_asc >> 8;   /* scan code in high byte */
	        printf("Character is %d\n", ch) ;
	        if (ch == 0) {
	            printf("\tExtended character:  scan is %d\n", scan) ;
	        }
	    }  while (ch != 27) ;   /* exit loop on ESC key */
	}
