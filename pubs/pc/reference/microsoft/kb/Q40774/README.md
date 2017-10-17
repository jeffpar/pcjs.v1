---
layout: page
title: "Q40774: How to Pass a Far Pointer from Parent to Spawned Child in C"
permalink: /pubs/pc/reference/microsoft/kb/Q40774/
---

## Q40774: How to Pass a Far Pointer from Parent to Spawned Child in C

	Article: Q40774
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881208-7649
	Last Modified: 25-MAY-1989
	
	Question:
	
	Is it possible to hand over a far pointer from a parent process to a
	child process? My parent process is doing a memory allocation that it
	fills with data. I'd like to be able to access this data in the child
	process.
	
	Response:
	
	The best way to pass a pointer to a child is to convert the pointer to
	an ASCII string using sprintf, spawn the child with the string on the
	command line, and convert the string back to a pointer with sscanf.
	Below is a sample program that does this. Note that the program and
	the child process must be compiled separately. Be sure to pass a far
	(segment and offset) pointer rather than a near (offset only)
	pointer. Attempting to pass a near pointer will not work.
	
	It is also possible to leave the pointer in an agreed-upon memory
	area. Frequently, unused interrupt vectors are used for this purpose.
	We do not recommend this method because it could cause conflicts with
	other software using the same memory. The method described above
	is much safer.
	
	A sample parent program and child program follow:
	
	/**************** parent process ****************/
	#include <process.h>
	#include <stdlib.h>
	#include <signal.h>
	#include <stdio.h>
	#include <string.h>
	
	char buffer[80];            /* buffer to be passed to child */
	char ascptr[20];            /* holds ASCII version of ptr.  */
	
	void main(void)
	{
	int ret;
	
	                            /* initial string */
	    strcpy(buffer, "Main1");
	    printf("Beginning main1...\nString is:  %s\n", buffer);
	
	                            /* convert address to ASCII */
	    sprintf(ascptr, "%p", buffer);
	    printf("ASCII version of pointer is: %p\nSpawning main2...\n\n",
	            ascptr);
	
	                            /* spawn, passing ASCII address on
	                               command line */
	    ret = spawnlp(P_WAIT, "main2.exe", "main2", ascptr, NULL);
	    printf("\nBack to main1--spawnlp returned %d\n", ret);
	
	                            /* Show that string is changed */
	    printf("String is now:  %s\nAll done", buffer);
	    exit(0);
	}
	/* end of program number one*/
	
	/**************** child process--compile seperately! *************/
	#include <process.h>
	#include <stdlib.h>
	#include <signal.h>
	#include <stdio.h>
	#include <string.h>
	#include <ctype.h>
	
	char far *ptrstuff;
	
	void main(int argc, char **argv)
	{
	int ch;
	
	    printf("In main2:  argv[1] is %s\n", argv[1]);
	    if (argc != 2) {        /* error in argument list */
	        printf("Error in argument list to main2\n");
	        exit(1);
	    }
	
	                            /* retrieve pointer value from string */
	    sscanf(argv[1], "%p", &ptrstuff);
	    printf("\nPointer is actually set to:  %p\n", ptrstuff);
	
	                            /* check to see that it's right */
	    printf("Pointer points to: %s\n", ptrstuff);
	
	                            /* change string (CAREFULLY!!!!!) */
	    printf("Warning:  modifying the string incorrectly could hang "
	           "your system...\n");
	    printf("\007Should I modify this string? ");
	    ch = getchar();
	    if (toupper(ch) == 'Y')  {
	        strcpy(ptrstuff, "2nd main");
	        printf("Changed string to: %s\n", ptrstuff);
	    }
	    else printf("String not changed....\n");
	
	    printf("Exiting main2...\n");
	    exit(0);
	}
	/* end of child process */
