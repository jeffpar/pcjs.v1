---
layout: page
title: "Q29852: Appending to CTRL+Z Terminated File with Fopen()"
permalink: /pubs/pc/reference/microsoft/kb/Q29852/
---

	Article: Q29852
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 23-SEP-1988
	
	When appending to a stream file that is terminated with the
	end-of-file marker CTRL+Z (CONTROL+Z or the ASCII code 1A
	hexadecimal), use the "a+" type with the fopen() function. The "+" in
	the type "a+" allows for both writing and reading.
	
	If you use the "a" type with fopen() for appending in write-only mode,
	the end-of-file marker will not be removed. Subsequently using the DOS
	type command on the file will only display data up to the original
	end-of-file marker, and will not display appended data.
	
	The fopen() type "a+" will allow the removal of the end-of-file marker
	from the file before appending, so that the appended data can then be
	displayed by the DOS type command.
	
	The "a+" is required because DOS must be permitted to read the file to
	locate the end-of-file marker and overwrite it with appended data.
	Using the "a" type prohibits DOS from reading the file, so DOS is
	unable to find the end-of-file marker for overwriting and instead the
	appended data is written after the end-of-file marker.
