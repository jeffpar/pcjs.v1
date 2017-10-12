---
layout: page
title: "Q40349: Chmod() on an Open File"
permalink: /pubs/pc/reference/microsoft/kb/Q40349/
---

	Article: Q40349
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 16-MAY-1989
	
	When a file has been opened, it is not valid to perform a chmod() on
	the file. Although some operating systems (for example, UNIX) allow a
	program to change the permission of a file while it it open, MS-DOS
	requires the file to be closed before performing this function.
	Unusual results can occur, particularly when SHARE.EXE is installed,
	if an attempt is made to chmod() on an open file. One of the results
	is an error indicating the file is full, when only 1 byte is written
	to an empty file.
