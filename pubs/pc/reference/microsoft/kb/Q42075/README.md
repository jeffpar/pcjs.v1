---
layout: page
title: "Q42075: Second fscanf Is Skipped During Run Time"
permalink: /pubs/pc/reference/microsoft/kb/Q42075/
---

## Q42075: Second fscanf Is Skipped During Run Time

	Article: Q42075
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 25-MAY-1989
	
	Question:
	
	I am using fscanf to read from the keyboard. Why is the second fscanf
	is skipped in the program below during run time?
	
	Response:
	
	The following is stated in the "Microsoft C 5.1 Optimizing Compiler
	Run-Time Library Reference" on Page 503 (in the description of the
	char format specifier):
	
	   White-space characters that are ordinarily skipped are read when %c
	   is specified; to read the next non-white-space character, use %1s.
	
	Note: You need an array of two characters for %1s because scanf will
	also put a terminating null in the string.
	
	Thus, after the first character is read in the example below, the
	following newline (e.g. linefeed, 0A hex) that is still in the C file
	buffer for stdin is read by the second fscanf (or scanf), causing the
	"second" prompt to be skipped during run time. The following is an
	example:
	
	#include <stdio.h>
	main()
	{
	  char a,b[2];
	  do
	   {
	     fprintf (stdout, "\n Enter first single character\n");
	     fscanf (stdin, "%c", &a);
	
	     fprintf (stdout, "second\n");
	     fscanf (stdin, "%c", b);       /*this will get the new-line*/
	   }
	   while (b != 'y');
	}
	
	To work around this problem, use the format specifier %1s instead of
	%c. Don't forget to pass scanf an array of two characters.
	
	Alternately, the fflush() function may be used to flush all characters,
	including white space, out of the specified buffer after each fscanf or
	scanf, or flushall() may be used to flush all file buffers. However, using
	these functions wouldn't leave any characters in the file buffer for
	later scanfs.
