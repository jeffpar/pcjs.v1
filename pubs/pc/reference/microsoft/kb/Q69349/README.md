---
layout: page
title: "Q69349: File Component Constants Increased Beginning with C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q69349/
---

## Q69349: File Component Constants Increased Beginning with C 6.00

	Article: Q69349
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 25-FEB-1991
	
	The following manifest constants (found in STDLIB.H) were changed
	beginning with C version 6.00:
	
	   _MAX_PATH       260     /* max. length of full pathname */
	   _MAX_DRIVE      3       /* max. length of drive component */
	   _MAX_DIR        256     /* max. length of path component */
	   _MAX_FNAME      256     /* max. length of filename component */
	   _MAX_EXT        256     /* max. length of extension component */
	
	Prior to C 6.00, these constants were defined as follows:
	
	   _MAX_PATH       144
	   _MAX_DRIVE      3
	   _MAX_DIR        130
	   _MAX_FNAME      9
	   _MAX_EXT        5
	
	These changes may cause unexpected results if filenames longer than
	eight characters are entered for use under DOS. The sample code below
	demonstrates the differences.
	
	The changes in the constants were made to allow for longer filenames
	and extensions in future operating systems, as well as the current
	implementation of the High Performance File System (HPFS) introduced
	in OS/2 version 1.20. The potential for problems is greatest when
	buffers are used that are not as big as the new constant values. This
	generally occurs when porting code from a previous version of the
	compiler to C version 6.00 or later.
	
	There are several ways to protect against problems that may occur in
	your code because of this change:
	
	1. Always declare filename buffers with the actual constants, for
	   example:
	
	      char file_name[_MAX_FNAME];
	
	2. Provide error checking before file operations are performed, such
	   as:
	
	      #define DOS_FILE_NAME_LENGTH 8
	
	      if ( strlen(file_name) > DOS_FILE_NAME_LENGTH )
	           printf("File name too long, try again");
	
	3. In extreme cases, you can change the constants in STDLIB.H back to
	   the previous values, but this will also require the purchase of the
	   Microsoft C run-time library source code so that you may rebuild
	   the affected modules in the run-time library. The one advantage of
	   this method is that it saves the memory used by buffers declared
	   with the larger values (840 bytes).
	
	The sample program below prompts for a filename to be input. If the
	input file specification is
	
	   C:\PATHPATHPATH\NAMENAMENAME.EXTEXT
	
	then the output with C version 5.10 will be
	
	    Old path was : C:\PATHPATHPATH\NAMENAMENAME.EXTEXT
	    Drive is     : C:
	    Dir is       : \PATHPATHPATH\
	    Fname is     : NAMENAME
	    Extension is : .EXT
	    New path is  : C:\PATHPATHPATH\NAMENAME.EXT
	
	while, with C version 6.00, the ouput will be:
	
	    Old path was : C:\PATHPATHPATH\NAMENAMENAME.EXTEXT
	    Drive is     : C:
	    Dir is       : \PATHPATHPATH\
	    Fname is     : NAMENAMENAME
	    Extension is : .EXTEXT
	    New path is  : C:\PATHPATHPATH\NAMENAMENAME.EXTEXT
	
	Notice that in C 5.10, the name is truncated to eight characters and
	the extension is truncated to three characters (plus the period),
	while in C 6.00 the name and extension are left unchanged.
	
	Note that these same new larger constants are present in QuickC
	beginning with versions 2.50 and 2.51 because these packages share
	the same include files as C 6.00.
	
	Sample Code
	-----------
	
	/* Compile options needed: none
	*/
	#include <stdio.h>
	#include <stdlib.h>
	
	void main( void)
	{
	   char oldpath[_MAX_PATH];
	   char newpath[_MAX_PATH];
	   char   drive[_MAX_DRIVE];
	   char     dir[_MAX_DIR];
	   char   fname[_MAX_FNAME];
	   char     ext[_MAX_EXT];
	
	   printf( "Enter a file name: " );
	   gets( oldpath );
	
	   _splitpath( oldpath, drive, dir, fname, ext );
	   _makepath( newpath, drive, dir, fname, ext );
	
	   printf( "Old path was : %s\n", oldpath);
	   printf( "Drive is     : %s\n", drive);
	   printf( "Dir is       : %s\n", dir);
	   printf( "Fname is     : %s\n", fname);
	   printf( "Extension is : %s\n", ext);
	   printf( "New path is  : %s\n", newpath);
	}
