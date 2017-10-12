---
layout: page
title: "Q49006: DOS APPEND Is Not Utilized with access() Function"
permalink: /pubs/pc/reference/microsoft/kb/Q49006/
---

	Article: Q49006
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC
	Last Modified: 16-JAN-1990
	
	The Microsoft C run-time library function, access(), determines
	whether or not a specified file exists and can be accessed in read
	and/or write mode(s). The access() function searches the current
	working directory for the particular file or the directory specified
	by a path to the file.
	
	The DOS APPEND command, which establishes a search path for data files
	and works similarly to the PATH environment variable, appears to be a
	way to assist access() in finding files outside the current working
	directory without having to supply a path. However, the APPEND command
	does not search the data path when locating a file to be used by the
	access() function. Consequently, access() fails when searching for a
	file issued with no path and that is not in the current working
	directory.
	
	As documented in the "Microsoft MS-DOS User's Guide and User's
	Reference" on Page 30, APPEND searches the data path for all files
	with only the following MS-DOS system calls:
	
	   Code          Function
	   ----          --------
	
	   0FH           Open File (FCB)
	   23H           Get (FCB) File Size
	   3DH           Open Handle
	   11H           FCB search first  (with /x switch only)
	   4EH           Handle find first (with /x switch only)
	   4BH           Exec (with /x switch only)
	
	The access() function makes an MS-DOS system call to interrupt 21H
	function 43H, which sets and retrieves file attributes. Since this is
	not a system call listed above, APPEND does not perform file
	searching.
	
	The following program illustrates the APPEND limitation. The program
	uses access() to determine whether the file named TEST exists. Assume
	that the TEST data file is not in the current working directory, but
	instead is in a directory called c:\foo, and that the APPEND command
	"APPEND=c:\foo" was issued previously to set the appropriate search
	path.
	
	Sample Program
	--------------
	
	#include <io.h>
	#include <fcntl.h>
	#include <stdio.h>
	
	FILE * stream;
	
	void main( void )
	{
	  /* check for existence of TEST fails despite having APPEND set */
	  if ((access( "TEST", 0 )) == -1 )
	  {
	        printf( "file was not found with APPEND set\n\n" );
	
	  /* however, fopen() recognizes APPEND for successful access */
	        if ((stream = fopen( "TEST", "r")) != NULL )
	            printf( "file opened successfully using APPEND" );
	  }
	}
