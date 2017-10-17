---
layout: page
title: "Q35245: Fixed-Length Strings Are Initialized to NULL (0), Not Blanks"
permalink: /pubs/pc/reference/microsoft/kb/Q35245/
---

## Q35245: Fixed-Length Strings Are Initialized to NULL (0), Not Blanks

	Article: Q35245
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom
	Last Modified: 12-DEC-1989
	
	The information below about fixed-length string arrays should be
	inserted in the following manuals:
	
	1. "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	
	2. "Microsoft BASIC Compiler 6.0: BASIC Language Reference" for
	   Versions 6.00 and 6.00b for MS OS/2 and MS-DOS
	
	On Pages 156, 174, and 352, under the DIM, ERASE, and REDIM
	statements, the above manuals state that elements of string arrays are
	initialized to null strings (strings of zero length). However, this is
	not the case with fixed-length strings. Fixed-length strings are
	initialized as a string of null bytes (with ASCII value of 0). The LEN
	function always returns the complete length of the fixed-length
	string. If a fixed-length string is initialized to "" (the null
	string), it is completely filled with blank spaces (ASCII value of
	32).
	
	This documentation error was corrected in the QuickBASIC 4.50 and
	Microsoft BASIC PDS 7.00 documentation.
	
	The following is a code example:
	
	DIM j AS STRING * 4
	c$ = CHR$(0) + CHR$(0) + CHR$(0) + CHR$(0)
	CLS
	PRINT "j is printed between the stars:  *"; j; "*"
	PRINT "j looks like a string of blanks, but it's not."
	IF j = c$ THEN PRINT "j equals CHR$(0) + CHR$(0) + CHR$(0) + CHR$(0)."
	IF j <> "" THEN PRINT "j does not equal "; CHR$(34); CHR$(34);
	IF j <> "    " THEN PRINT " or "; CHR$(34); "    "; CHR$(34); "."
	PRINT "But if I set j to "; CHR$(34); CHR$(34);
	j = ""
	IF j = "    " THEN
	   PRINT " then j will equal "; CHR$(34); "    "; CHR$(34); "."
	END IF
	
	The following is the output from the program above:
	
	j is printed between the stars:  *    *
	j looks like a string of blanks, but it's not.
	j equals CHR$(0) + CHR$(0) + CHR$(0) + CHR$(0).
	j does not equal "" or "    ".
	But if I set j to "" then j will equal "    ".
