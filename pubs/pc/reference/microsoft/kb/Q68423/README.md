---
layout: page
title: "Q68423: The Use of a CTRL+Z Is Limited in Text Files"
permalink: /pubs/pc/reference/microsoft/kb/Q68423/
---

## Q68423: The Use of a CTRL+Z Is Limited in Text Files

	Article: Q68423
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 23-JAN-1991
	
	--------
	
	The use of a CTRL+Z (hex 1A, decimal 26) is limited in a file opened
	in text (translated) mode. If a file contains a CTRL+Z, there can be
	only one occurrence of it and it must be the last character in the
	file.
	
	No other instance of a CTRL+Z is allowed in text mode. By using
	multiple CTRL+Z's, or having characters after the CTRL+Z, you may
	cause fseek(), or run-time functions that call fseek(), to behave in
	an unexpected manner.
	
	-----------------
	
	By performing one of the following steps, these functions will perform
	as expected if you have multiple CTRL+Z's in the file.
	
	1. Open the file in binary (untranslated) mode.
	
	2. Convert your input file to meet the previously mentioned conditions
	   of a text file.
	
	When opening a file in binary mode, you must remember that the file is
	untranslated. This means that on input, the carriage-return line-feed
	(CR-LF) combination is not translated into a single line-feed (LF)
	character, and on output, the (LF) character is not translated into a
	(CR-LF) combination.
	
	This may necessitate modifications to your I/O routines that deal with
	newlines (\n) and carriage returns (\r).
	
	Examples of Opening Binary Files
	---------------------------------
	
	   FILE * fileptr;
	   fileptr = fopen( "filename.dat", "rb+");
	
	Opens a file called FILENAME.DAT for both reading and writing in
	binary mode. The letter "b" in the access mode designates opening for
	binary mode.
	
	   int filehndl;
	   filehndl = open( "filename.dat", O_CREAT | O_BINARY | O_RDWR,
	                                    S_IWRITE | S_IREAD);
	
	Opens a file called FILENAME.DAT for both reading and writing in
	binary mode. The O_BINARY constant designates the file to be opened in
	binary mode.
	
	With both of the file-open commands, it should be noted that the text
	(translated) mode is the default mode. You may link with an object
	module called BINMODE.OBJ to change the default mode to binary. This
	file is located in your LIB subdirectory.
	
	This is expected behavior from the Microsoft C Compiler versions 6.00
	and 6.00a.
