---
layout: page
title: "Q58779: After Increasing Available File Handles, exec Hangs Machine"
permalink: /pubs/pc/reference/microsoft/kb/Q58779/
---

	Article: Q58779
	Product: Microsoft C
	Version(s): 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.00 buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 14-JAN-1991
	
	If you have increased the maximum number of file handles and buffers
	available to the system by changing the _file.c and crt0dat.asm
	start-up source files as outlined in the README.DOC file, and then
	write a program that does multiple execs, your machine may hang under
	DOS.
	
	There is a known incompatibility between changing the start-up source
	code for the optimizing C compilers and exec'ing multiple child
	processes.
	
	The following sample code demonstrates this problem:
	
	#define FILES_OPEN 30
	
	#include <stdio.h>
	#include <conio.h>
	#include <process.h>
	#include <errno.h>
	#include <string.h>
	
	void main ( void )
	{
	    short numfiles, returnval;
	    FILE *FilePointer;
	    char fname[80];
	
	    for ( numfiles = 0; numfiles < FILES_OPEN; numfiles ++ )
	    {
	        sprintf ( fname, "file%2d.dat", numfiles ) ;
	        printf ( "Opening file #%2d :%s\n", numfiles, fname ) ;
	
	        if ( ( FilePointer = fopen ( fname, "a+" ) ) == NULL )
	        {
	            printf ( "fopen failed on file #%2d", numfiles ) ;
	            exit ( -2 ) ;
	        }
	    }
	
	    printf ( " Press <esc> to quit, other to continue exec'ing child: \n" ) ;
	
	    if ( ( returnval = getche() ) == 27 )
	    {
	        printf ( "Quitting...\n" ) ;
	        exit ( 1 ) ;
	    }
	
	    if ( ( returnval = execlp ( "child.exe", "child.exe", NULL )) == -1 )
	    {
	        printf ( "Error exec'ing child; ERRNO: %d\n", errno ) ;
	    }
	}
	
	If you make a copy of this program and call it child.c, and change all
	references in the child.c program from child to parent, you will have
	a loop of exec's set up. You can exec the child once, then your
	machine either hangs on the call to exec the first program again or as
	the second program is finishing execution.
