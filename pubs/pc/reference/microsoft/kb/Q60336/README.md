---
layout: page
title: "Q60336: fscanf() Fails to Read Consecutive Lines"
permalink: /pubs/pc/reference/microsoft/kb/Q60336/
---

	Article: Q60336
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 19-APR-1990
	
	If you try to read lines of text using fscanf() from a file opened in
	text mode, and define [^\n] as the delimiter, you will find that your
	program will read only the first line of the text file.
	
	Sample Code
	-----------
	
	FILE *fin;
	char Line[80];
	
	while ( ( fscanf(fin,"%[^\n]",line) ) !=EOF  )
	{
	   printf("Line = %s \n",line);
	}
	
	At first glance, the sample code appears to read and print lines from
	a text file until the end of the file is reached. However, this is not
	the case.
	
	The fscanf() function reads up to but not including the delimiting
	character. Therefore, the file stream is stopped at the first "\n" in
	the file. Subsequent fscanf() calls fail because the file is still at
	the first delimiting character and fscanf() will not move past it.
	
	To move the file stream beyond the delimiting character, the following
	are two workarounds:
	
	1. Place a fgetc() after the fscanf() to position the file pointer
	   past the "\n".
	
	2. Change the fscanf() call to the following:
	
	      fscanf(fin, "%[^\n]%*c", line)
	
	   This automatically reads the next character.
	
	The corrected code is as follows:
	
	FILE *fin;
	char Line[80];
	
	while ( ( fscanf(fin,"%[^\n]",line) ) !=EOF  )
	{
	   fgetc(fin);       // Reads in "\n" character and moves file
	                     // stream past delimiting character
	   printf("Line = %s \n",line);
	}
