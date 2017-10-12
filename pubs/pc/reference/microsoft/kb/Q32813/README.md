---
layout: page
title: "Q32813: The fopen Function Fails to Open Printer in Bound Application"
permalink: /pubs/pc/reference/microsoft/kb/Q32813/
---

	Article: Q32813
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1990
	
	Attempting to use the C run-time function fopen() to open the printer
	will fail in real mode if the application calling the function is
	bound. The "invalid argument" error is returned.
	
	This problem is caused by the Family API DosOpen function. It will
	fail to open the printer when called with a flag that specifies
	"truncate if the file exists," which is the flag used by fopen().
	
	The following program demonstrates a work around for this problem
	using the C run-time library functions open() and fdopen():
	The program below uses open() to get a file handle for the printer.
	Note that the oflag used is O_WRONLY. ORing in O_TRUNC would fail in
	real mode. The device name "lpt1" or "lpt2" could be used instead of
	"prn", depending on how the computer is set up. The generic name for
	the printer is "prn".
	
	Then the fdopen() function is used to create a stream for the printer,
	and the printer is written to by the fprintf() function.
	
	The following is the sample program:
	
	#include <fcntl.h>      /* include files for open() */
	#include <sys\types.h>
	#include <sys\stat.h>
	#include <io.h>
	#include <stdio.h>      /* include file for printf() and
	fdopen() */
	
	int   fh;     /* file handle for printer */
	FILE *stream; /* stream for printer     */
	
	main() {
	/* open file handle for printer, check for open failure */
	    if ((fh = open("prn",O_WRONLY)) == -1 )
	        printf("Opening file handle failed.\n");
	
	/* associate stream for fh above, check for failure */
	    else {
	        if((stream = fdopen(fh,"w")) == NULL)
	            printf("Creation of stream from file handle
	failed.\n");
	
	/* if previous function calls succeeded, print "Hello" */
	        else
	            fprintf(stream,"Hello\n");
	        }
	    }
