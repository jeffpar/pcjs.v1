---
layout: page
title: "Q48090: Using a Wildcard Argument with the remove() Function"
permalink: /pubs/pc/reference/microsoft/kb/Q48090/
---

## Q48090: Using a Wildcard Argument with the remove() Function

	Article: Q48090
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-JAN-1990
	
	Question:
	
	I'm using the remove() function to delete my files, but when I pass
	the wildcard as an argument, the function does not delete any files.
	Is there any why I can use the remove() function to delete all the
	files in the directory when I specify it to?
	
	Response:
	
	Yes; use the _dos_findfirst and _dos_findnext functions to search for
	each file and then use the remove() function to delete each file. The
	following example demonstrates how to write a code equivalent to
	remove("*.*"):
	
	Code Example
	------------
	
	#include <stdio.h>
	#include <dos.h>
	#include <io.h>
	
	main ()
	{
	   struct find_t  c_file;
	   char fn[12];
	
	   printf ("Enter file to delete: ");
	   scanf ("%s", fn);
	
	/* This code section will delete all the files in the directory. */
	   if (strcmp(fn, "*.*") == 0) {
	     _dos_findfirst ("*.*", _A_NORMAL, &c_file);
	     do {
	            remove (c_file.name);
	        } while (_dos_findnext (&c_file) == 0);
	     }
	   else
	
	/* This section will delete only one file. */
	     if (remove (fn) == -1)
	        printf ("File not found\n");
	     else
	        printf ("File successfully deleted\n");
	}
