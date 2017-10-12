---
layout: page
title: "Q58427: Changing STDIN Translation Mode from Text to Binary"
permalink: /pubs/pc/reference/microsoft/kb/Q58427/
---

	Article: Q58427
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 7-MAR-1990
	
	Question:
	
	Why is it that when I enter a ^Z (CTRL+Z) for a string input in
	response to gets() or scanf(), the next line does not prompt me for an
	input?
	
	Response:
	
	Since STDIN is a predefined file pointer opened in text mode, and a ^Z
	character is an end-of-file marker in DOS, the ^Z character
	automatically closes the file pointer. The gets() or scanf() functions
	do not stop to accept input from STDIN following the previous input
	containing a ^Z character.
	
	To work around this problem, change the translation mode of STDIN from
	text mode to binary mode. Since the ^Z character is not translated as
	an end-of-file character in binary mode, the gets() from the following
	example only accepts input following a ^Z from STDIN after the
	translation.
	
	To change STDIN from text mode to binary mode, use the setmode()
	run-time function to change the translation mode. The following code
	demonstrates this behavior, and includes the setmode() function to
	show how to change STDIN from text mode to binary mode. Remove the
	comment delimiters to observe the difference in the program's behavior
	after adding the setmode() function.
	
	Code Example
	------------
	
	#include <stdio.h>
	#include <string.h>
	#include <fcntl.h>
	
	void main (void)
	{
	   char str1[20];
	
	/* if( setmode ( fileno ( stdin ), O_BINARY ) == -1 )
	          perror ( "Cannot set stdin to binary mode" );
	   else
	          printf ( "stdin mode successfully set to binary\n" );
	*/
	   do {
	          printf ( "Enter a string : " );
	          gets ( str1 );
	   } while ( strcmp( str1,"n" ) );
	
	}
	
	Compile the above code and run the program. If you enter a string
	and then press the ENTER key, the program will loop and prompt for
	another string. However, if at the prompt you enter a ^Z or a string
	followed by a ^Z, the program will loop indefinitely. It does not pause
	at the gets() statement and wait for your input.
	
	Now, uncomment the if-else clause. Recompile the program and run it.
	Input that includes a ^Z character is now accepted without infinite
	looping.
