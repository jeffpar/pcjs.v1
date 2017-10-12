---
layout: page
title: "Q43975: QuickC: Increasing Maximum Number of Open Files and Streams"
permalink: /pubs/pc/reference/microsoft/kb/Q43975/
---

	Article: Q43975
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	Question:
	
	Is it possible to increase the maximum number of open files and
	maximum number of streams under QuickC Version 2.00?
	
	Response:
	
	QuickC 2.00 does not come with start-up code; therefore, you MUST have
	the Microsoft C 5.10 Optimizing Compiler to increase the maximum
	number of open files and streams. CRT0DAT.ASM and _FILE.C should be
	modified as described in the README.DOC included in the C 5.10
	package.
	
	Limited testing has been performed with QuickC 2.00 after altering
	the start-up code in this manner; however, Microsoft cannot guarantee
	that it will work properly in all cases.
	
	After successfully assembling CRT0DAT.ASM (use the /MX switch) and
	successfully compiling _FILE.C, you must do one of the following:
	
	1. Explicitly link your program with the new CRT0DAT.OBJ and/or
	   _FILE.OBJ by compiling and linking on the command line using QuickC
	   2.00. One possible command might be as follows:
	
	      QCL TEST.C CRT0DAT /LINK /NOE
	
	2. You can also link with the modified start-up code by creating a
	   program list in QuickC 2.00, which should include TEST.C,
	   CRT0DAT.OBJ, and/or _FILE.OBJ. Do not forget to turn the extended
	   dictionary flag OFF under the linker flags.
	
	3. Replace the CRT0DAT.OBJ and/or _FILE.OBJ in the appropriate model
	   of the QuickC 2.00 run-time library. You can use the library
	   manager and the Replace command symbol (-+) in the "commands" field
	   to replace a module in the library.
	
	Note: Remember that the number of low-level files must be greater than
	or equal to the number of stream-level files. Therefore, if you
	increase the value of _NFILE_ in _FILE.C, you must also increase the
	value of _NFILE_ in CRT0DAT.ASM.
	
	The following program will open up to 64 files, write to them, close
	them, open the files again, and read from them:
	
	#include <stdio.h>
	#include <string.h>
	
	#define MAX_FILES  64
	#define MAX_BUFFER 128
	#define FILE_BASE  "MAX"
	#define FILE_EXT   ".TXT"
	#define TO_WRITE   "This is a bunch of text!"
	
	void main( void )
	{
	    FILE *streams[MAX_FILES];
	    char  buffer[MAX_BUFFER];
	    int   i;
	    int   max;
	    int   cmp;
	
	    /*  Open as many files as possible. */
	    for( i = 0; i < MAX_FILES; i++ )
	    {
	        sprintf( buffer, FILE_BASE "%2.2d" FILE_EXT, i + 1 );
	        streams[i] = fopen( buffer, "w" );
	        if( streams[i] == NULL )
	        {
	            fprintf( stderr, "Open #%2.2d failed.\n", i + 1 );
	            break;
	        }
	    }
	    max = i;
	
	    /*  Write to all open files. */
	    for( i = 0; i < max; i++ )
	        fputs( TO_WRITE, streams[i] );
	
	    /*  Close all open files. */
	    for( i = 0; i < max; i++ )
	        fclose( streams[i] );
	
	    /*  Open all of our files. */
	    for( i = 0; i < max; i++ )
	    {
	        sprintf( buffer, FILE_BASE "%2.2d" FILE_EXT, i + 1 );
	        streams[i] = fopen( buffer, "r" );
	        if( streams[i] == NULL )
	            fprintf( stderr, "Unable to re-open file #%2.2d\n", i + 1 );
	    }
	
	    /*  Read from all open files. */
	    for( i = 0; i < max; i++ )
	    {
	        fgets( buffer, MAX_BUFFER, streams[i] );
	        cmp = strcmp( buffer, TO_WRITE );
	        if( cmp != 0 )
	            fprintf( stderr, "Bad data in file #%2.2d\n", i + 1 );
	    }
	
	    /*  Close all open files. */
	    for( i = 0; i < max; i++ )
	        fclose( streams[i] );
	
	    fputs( "All done!\n", stdout );
	}
