---
layout: page
title: "Q58667: Redirecting stdout to and from a File Using C"
permalink: /pubs/pc/reference/microsoft/kb/Q58667/
---

	Article: Q58667
	Product: Microsoft C
	Version(s): 5.00 5.10  | 5.10
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 26-FEB-1990
	
	Question:
	
	How do I redirect stdout to a file from a C program, then get the
	original stdout back at a later time in the same program?
	
	Response:
	
	The C function typically used to redirect stdout or stdin is
	freopen(). To redirect stdout to a file called FOO.TXT, use the
	following call:
	
	   freopen( "foo.txt", "w", stdout );
	
	This statement causes all subsequent output, which is typically
	directed towards stdout, to go to the file FOO.TXT.
	
	To get stdout back to the keyboard (the default stdout), use the
	following call:
	
	   freopen( "CON", "w", stdout );
	
	In both of these cases, check the return value of freopen() to make
	sure that the redirection actually took place.
	
	Below is a short program to demonstrate the redirection of stdout:
	
	#include <stdio.h>
	#include <stdlib.h>
	
	void main(void)
	{
	   FILE *stream ;
	
	   if((stream = freopen("foo.txt", "w", stdout)) == NULL)
	      exit(-1);
	
	   printf("this is stdout output\n");
	
	   stream = freopen("CON", "w", stdout);
	
	   printf("And now back to the console once again\n");
	}
	
	This program assumes that stdout is to be redirected toward the
	console at the end of the program.
