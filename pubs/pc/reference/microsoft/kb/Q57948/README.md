---
layout: page
title: "Q57948: Escape Character Erases First Characters in gets() String"
permalink: /pubs/pc/reference/microsoft/kb/Q57948/
---

## Q57948: Escape Character Erases First Characters in gets() String

	Article: Q57948
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_quickasm 1.00 1.01 2.00 2.01
	Last Modified: 26-JAN-1990
	
	If you enter the escape character (ASCII 1Bh) from the keyboard
	(console) into a string that gets(), cgets(), or fgets() is reading,
	all of the string previously read in is erased. The string pointer is
	reset so that characters following the escape character are read into
	the beginning of the string. This is consistent with the action done
	by the operating system (OS) to parse the input-line.
	
	However, if the escape character is input from a file by redirection,
	the entire string including the escape character will be read into the
	string.
	
	Code Example
	------------
	
	#include <conio.h>
	#include <stdio.h>
	
	char buf[22];
	char *result;
	
	void main(void)
	{
	     int i;
	     buf[0] = 20;
	
	     printf("Enter your text: \n");
	     result = gets(buf);
	
	     printf ( "Resulting String: %s\n", result );
	     for( i = 0; i < 20; i ++ )
	     {
	          printf("Buf[%2d] = %c (char)\n", i, buf[i]);
	     }
	}
	
	Enter the following string as a test:
	
	   abcdef<esc>ghijk
	
	Note that the resulting string is output as:
	
	   ghijk
	
	Now, using a text editor that will accept an escape character embedded
	in a string, create a data file with the same string. If the above
	program is run with input redirected from the data file, for example
	
	   program <test.dat
	
	the resulting string is output as follows:
	
	   abcdef<esc>ghijk
	
	This behavior occurs in the entire gets() family of routines,
	including gets(), cgets(), and fgets(). If the input is coming from
	the console, the run time will use the standard MS-DOS OS/2 keyboard
	read routines. On the other hand, if the input is coming from a file
	(through redirection) there is no editing performed by the OS and the
	file is read in literally.
