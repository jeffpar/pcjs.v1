---
layout: page
title: "Q50116: Fscanf() and White-Space Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q50116/
---

## Q50116: Fscanf() and White-Space Characters

	Article: Q50116
	Version(s): 5.00 5.10  |  5.10
	Operating System: MS-DOS     |  OS/2
	Flags: ENDUSER |
	Last Modified: 30-NOV-1989
	
	Problem:
	
	I try to read one integer on a line from a data file and then advance
	the file pointer to the next line using the following:
	
	    fscanf("%d\n", &INT);
	
	However, I am unable to do this. The file pointer seems to jump to the
	next character in the data file, wherever it may be, instead of
	stopping at the first position of the next line.
	
	Response:
	
	According to the "Microsoft C for the MS-DOS Operating System Run-time
	Library Reference," Page 501:
	
	   A white-space character (in the format string) causes scanf to
	   read, but not store, all consecutive white-space characters in the
	   input up to the next non-white-space character. One white-space
	   character in the format matches any number (including 0) and
	   combination of white-space characters in the input.
	
	In other words, because you have white space in your format specifier,
	"\n", after the %d, fscanf() eats up all white space AFTER the
	integer, including newline until the first nonwhite-space character is
	found.
	
	The following are possible workarounds:
	
	1. Use the following fscanf() statement:
	
	      fscanf("%d[^\n]%*c}, &INT)
	
	   This tells fscanf() to read an integer and then read UNTIL it finds
	   the "\n". At that point, it is necessary to read in the \n. The
	   "%*c" reads, but does not store, one character.
	
	2. Use fgets() to read in the line and then use sscanf to get the
	   value, as follows:
	
	      fgets( line, MAX_LINE_SIZE, stream );
	            sscanf( line, "%d", &INT);
