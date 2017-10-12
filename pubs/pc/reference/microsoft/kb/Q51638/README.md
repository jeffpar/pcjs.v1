---
layout: page
title: "Q51638: QuickC Err Msg: Cannot Load Binary File"
permalink: /pubs/pc/reference/microsoft/kb/Q51638/
---

	Article: Q51638
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist1.00 buglist1.01 buglist2.00 buglist2.01
	Last Modified: 21-MAR-1990
	
	Microsoft QuickC Versions 1.0x and 2.0x are unable to open data files
	created by fopen() and written to by fprintf() functions.
	
	The following program demonstrates this problem:
	
	     #include <stdio.h>
	
	     FILE *fooptr;
	
	     void main (void)
	     {
	          fooptr = fopen ("foo.dat","wt");
	
	          if (fooptr == NULL)
	               puts ("Can't open file.");
	
	          fprintf (fooptr, "This is a test");
	
	          fclose (fooptr);
	     }
	
	After running the program, load "foo.dat" into the QuickC environment.
	QuickC will report back with the following:
	
	   Cannot load binary file:
	             foo.dat
	
	Use the DOS TYPE command to see that the data file was written in text
	format. This file can also be loaded by other text editors such as the
	Microsoft Editor.
	
	Running CRLF.EXE to translate or remove any control characters does not
	resolve this problem.
	
	Microsoft has confirmed this to be a problem with QuickC Versions
	1.00, 1.01, 2.00, 2.01. We are researching this problem and will post
	new information here as it becomes available.
