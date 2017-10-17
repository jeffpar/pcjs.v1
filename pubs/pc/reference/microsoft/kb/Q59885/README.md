---
layout: page
title: "Q59885: Read() Run-Time Function Example Is Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q59885/
---

## Q59885: Read() Run-Time Function Example Is Incorrect

	Article: Q59885
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 17-JUL-1990
	
	On Page 481 of the "Microsoft C Optimizing Compiler: Run-Time Library
	Reference," Version 5.1 manual, the sample program for read() is
	incorrect. The conditional statement for the function read() should
	check for the value 65535 (0xFFFF or -1 for a signed int), instead of
	less than or equal to 0 (zero). Since bytesread is declared as an
	unsigned int, the value 0xFFFF is stored as 65535.
	
	Sample Code
	-----------
	
	#include <fcntl.h>            /* Needed only for O_RDWR definition */
	#include <io.h>
	#include <stdio.h>
	
	char buffer[60000];
	
	void main (void)
	{
	  int fh;
	  unsigned int nbytes = 60000, bytesread;
	
	  /* Open file for input: */
	  if ((fh = open ("data", O_RDONLY)) == -1)
	  {
	        perror ("open failed on input file");
	        exit(1);
	  }
	
	  /* Read in input: */
	
	  bytesread = read (fh, buffer, nbytes);
	  if ((bytesread == 0) || (bytesread == 65535))
	    perror ("Problem reading file");
	  else
	    printf ("Read %u bytes from file\n", bytesread);
	}
