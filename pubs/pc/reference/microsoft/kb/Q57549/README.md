---
layout: page
title: "Q57549: Displaying Only the Subdirectories with _A_SUBDIR"
permalink: /pubs/pc/reference/microsoft/kb/Q57549/
---

## Q57549: Displaying Only the Subdirectories with _A_SUBDIR

	Article: Q57549
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1990
	
	Question:
	
	I am using _dos_findfirst and _dos_findnext and using the _A_SUBDIR
	file attribute to find only the subdirectories. But I am getting not
	only the subdirectories, but also the filenames. Is there any way to
	have _dos_findfirst and _dos_findnext return just the subdirectories?
	
	Response:
	
	You can use _dos_findfirst and _dos_findnext, and by using _A_SUBDIR
	you can find just the subdirectories. Since the _A_SUBDIR attribute
	returns information about normal files as well as files with the
	subdirectory attribute, you must check each file to determine whether
	or not it is an actual subdirectory or a normal file. The following
	program demonstrates how to display just the subdirectories:
	
	Code Example
	------------
	
	#include <stdio.h>
	#include <dos.h>
	#include <direct.h>
	
	void display_directory ( struct find_t *find );       /* Prototypes */
	
	void main( void )
	{
	   struct find_t find;
	   char buffer[67];
	
	   getcwd (buffer, 66);
	   printf ("Current Working Directory: %s\n", buffer);
	
	 /* Find first matching file, then find additional matches. */
	   if ( !_dos_findfirst( "*.*", _A_SUBDIR, &find ))
	        display_directory ( &find );
	   while( !_dos_findnext ( &find ))
	        display_directory ( &find );
	}
	
	/* Displays Subdirectories in Current Directory */
	
	void display_directory ( struct find_t *pfind )
	{
	   /* Determines whether the file is a subdirectory */
	    if( pfind->attrib & _A_SUBDIR )
	       printf ( "<DIR> %-8s\n", pfind->name );
	}
