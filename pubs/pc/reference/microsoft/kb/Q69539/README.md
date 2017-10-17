---
layout: page
title: "Q69539: _cexit() Does Not Close Files Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q69539/
---

## Q69539: _cexit() Does Not Close Files Correctly

	Article: Q69539
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc buglist6.00 buglist6.00a
	Last Modified: 25-FEB-1991
	
	As stated in the online help, the _cexit() function performs clean-up
	operations and returns without terminating the process. The _cexit()
	function first calls the functions registered by the atexit() and
	onexit() routines, and then it should flush all I/O buffers and close
	all open files before returning.
	
	The _cexit() function works as described except that it does not close
	all the open files. The sample code below demonstrates this problem.
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
	
	Sample Code
	-----------
	
	*\
	
	#include<stdio.h>
	#include<stdlib.h>
	#include<process.h>
	
	void foo(void);
	
	void main(void)
	{
	    FILE *outfile;
	    int   retval;
	
	    atexit(foo);    /* set up function to invoke on exit */
	
	    if ( (outfile = fopen("TEST.TXT", "w")) == NULL )
	        {
	        printf("Could not open test file TEST.TXT");
	        exit(-1);
	        }
	
	    retval = fprintf(outfile, "This is line 1.\n");
	    if ( retval >= 0 )
	        printf("\nFirst line written successfully to file.\n");
	    else
	        printf("\nFile write failed on first attempt!\n");
	
	    _cexit();   /* Call _cexit() -- files should all be closed */
	
	    retval = fprintf(outfile, "This line should not be written!\n");
	    if ( retval >= 0 )
	        printf("Error - Write to file succeeded for file that should"
	               " have been closed!\n");
	    else
	        printf("File write failed on second attempt as expected!\n");
	
	    fclose(outfile);
	}
	
	void foo(void)
	{
	    printf("\nThis is the exit function code.\n\n");
	}
