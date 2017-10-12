---
layout: page
title: "Q41025: Using _dos_setdrive and _searchenv to Open a File"
permalink: /pubs/pc/reference/microsoft/kb/Q41025/
---

	Article: Q41025
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	Question:
	
	How can I open a file on a floppy drive without explicitly specifying
	a full path in the fopen statement?
	
	Response:
	
	You can use the run-time function _dos_setdrive to set the current
	drive to floppy Drive A. Then use the function _searchenv to search
	for the filename on a floppy disk in Drive A. The full path to the
	specified file will be copied to the buffer. Then you can use fopen to
	open the file specified by the buffer.
	
	Note: _searchenv works properly using QuickC Version 2.00. This
	program will not work correctly under the earlier versions of QuickC
	or C Version 5.10.
	
	The following is a sample code:
	
	#include <dos.h>
	#include <stdio.h>
	#include <stdlib.h>
	
	main()
	{
	    FILE *stream;
	    unsigned drive;
	    char buffer[40];
	
	    /* set default drive to be drive A */
	    _dos_setdrive (1, &drive);
	    _dos_getdrive (&drive);
	    printf( "Current drive: %c:\n", 'A' + drive - 1 );
	
	    /* Search for file at root level */
	    _searchenv("data","",buffer);
	    printf("path: %s\n", buffer);
	
	    if ((stream = fopen(buffer,"r")) == NULL)
	       printf ("Could not open file\n");
	    else
	       printf("File opened for reading\n");
	}
