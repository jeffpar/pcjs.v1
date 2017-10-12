---
layout: page
title: "Q39216: Opening Files Using Command Line Arguments."
permalink: /pubs/pc/reference/microsoft/kb/Q39216/
---

	Article: Q39216
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 29-DEC-1988
	
	File names may be specified as command line arguments to a C
	program.  The example below uses the first command line argument as
	the name of the input file and the second as the name of the output
	file.  The parameter argv, which is declared by main(), is used to
	access the command line arguments.
	
	In the example below, the following occurs:
	
	1. argv[0] will contain a full path to the source (exe) file
	
	2. argv[1] will contain the first argument, which is the input file
	name
	
	3. argv[2] will contain the second argument, which is the output file
	name
	
	The following program opens a file for reading and writing and
	also prints argv[0], argv[1], and argv[2].  Note that argc is checked
	to make sure that two argument strings were actually passed and that
	the file pointers are checked to make sure that the files were
	actually opened.
	
	#include <stdio.h>
	
	main (argc,argv)
	int argc;
	char *argv[];
	{
	  FILE *in, *out;
	
	  if (argc < 3)  {         /* enough arguments? */
	    puts("Usage:  demo infile outfile");
	    exit(1);
	  }
	
	  printf("%s\n", argv[0]);
	  printf("%s\n", argv[1]);
	  printf("%s\n", argv[2]);
	
	  in  = fopen (argv[1],"r");
	  out = fopen (argv[2],"w");
	
	  if (in == NULL || out == NULL)  {
	    puts("Could not open both files");
	    exit(2);
	  }
	  puts("Opened both files OK");
	  exit(0);
	}
	
	The command line: "C:\>demo infile outfile" produces the
	following output if infile and outfile can be opened:
	
	   C:\demo.exe
	   infile
	   outfile
	   Opened both files OK
