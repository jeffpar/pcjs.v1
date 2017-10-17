---
layout: page
title: "Q57888: Return Value for getch() on Extended Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q57888/
---

## Q57888: Return Value for getch() on Extended Characters

	Article: Q57888
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 22-JAN-1990
	
	When reading extended characters, you must make two calls to getch()
	because the first call returns a value indicating that the key is an
	extended character. The second call returns the actual key code. This
	is how extended keys are detected.
	
	When you are reading an extended character, the first return value
	will be either 0xE0 or 0x00, depending on which extended key is
	pressed.
	
	Sample Program
	--------------
	
	#include <stdio.h>
	#include <conio.h>
	void main(void)
	{
	    int ch, scan;
	
	    do {
	        ch = getch();    /* 1st getch() gets ASCII code */
	        printf("Character is %d\n", ch);
	        if (ch == 0x00 || 0XE0)  { /* if extended key */
	            scan = getch();  /* 2nd getch() gets "scan code" */
	            printf("\tExtended character:  scan is %d\n", scan);
	        }
	    }  while (ch != 27);    /* exit loop on ESC */
	}
	
	For a discussion of keystrokes and scan codes, refer to "The New Peter
	Norton Programmer's Guide to the IBM PC & PS/2," Pages 128 to 130.
