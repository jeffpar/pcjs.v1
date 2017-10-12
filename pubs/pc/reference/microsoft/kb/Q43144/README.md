---
layout: page
title: "Q43144: C: Using the _dos_findfirst and _dosfindnext Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q43144/
---

	Article: Q43144
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS_DOS    | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	Question:
	
	Why do all my files show up in addition to the subdirectories when
	using the _dos_findfirst and _dos_findnext functions to find all the
	subdirectories in my working directory?
	
	Response:
	
	When the attribute argument to the _dos_findfirst and _dos_findnext
	functions is either _A_RDONLY, _A_HIDDEN, _A_SYSTEM, or _A_SUBDIR, the
	functions will return all normal-attribute files.  A normal-attribute
	file is any file that does not have a read-only, hidden, system, or
	directory attribute.
	
	Thus, the following function call will return either a normal file or
	a subdirectory:
	
	   _dos_findfirst( "*.*", _A_SUBDIR, &c_file )
	
	To verify that the returned c_file is a subdirectory, check the
	attribute field of the c_file to determine whether the _A_SUBDIR bit
	is set. If so, then it is a subdirectory. This process may be
	accomplished by bitwise-ANDing c_file.attrib with _A_SUBDIR and
	checking for a nonzero result.
	
	The following program illustrates the use of these functions:
	
	#include <dos.h>
	#include <stdio.h>
	
	main()
	{
	        struct find_t c_file;
	
	        _dos_findfirst( "*.*", _A_SUBDIR, &c_file );
	
	        if( c_file.attrib & _A_SUBDIR )
	        printf( "Directory listing %s\n", c_file.name );
	
	        while (_dos_findnext(&c_file) == 0)
	            if( c_file.attrib & _A_SUBDIR )
	            printf( "Directory listing %s\n", c_file.name );
	}
