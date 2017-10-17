---
layout: page
title: "Q21963: ENVIRON Statement Produces &quot;Out of Memory&quot; Error Message"
permalink: /pubs/pc/reference/microsoft/kb/Q21963/
---

## Q21963: ENVIRON Statement Produces &quot;Out of Memory&quot; Error Message

	Article: Q21963
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | b_basiccom
	Last Modified: 29-APR-1990
	
	Most forms of the ENVIRON statement produce the run-time error message
	"Out of memory" (on DOS Versions 2.x through 3.30). The following
	example produces the "Out of memory" error message:
	
	   ENVIRON "PATH=C:\COBOL"
	
	The following example usually works correctly, however, the ENVIRON
	statement is not very practical in QuickBASIC:
	
	   ENVIRON "PATH=;"
	
	Expanding the environment table cannot be done in a QuickBASIC program
	because the size of the environment table is limited to its size
	rounded up to the nearest multiple of 16 bytes, when QuickBASIC or a
	QuickBASIC program is initiated.
	
	QuickBASIC does not modify the actual DOS environment table; it only
	modifies a local copy.
	
	You can work around this problem by doing the following:
	
	1. SET a large string in the MS-DOS environment table before running
	   QB.EXE or a compiled program, as in the following example:
	
	   SET JUNK=123456789012345678901234567890
	
	2. Use the following ENVIRON statements in your program to set the
	   large string equal to a null string, then you can allocate strings
	   whose length totals up to the size that was deallocated:
	
	   PRINT ENVIRON$("JUNK")  ' DOS environment variables MUST be
	                           ' uppercase.
	
	ENVIRON "JUNK=;"           ' This deallocates environment table
	                           ' space.
	
	PRINT ENVIRON$("JUNK")     ' This confirms deallocation; prints
	                           ' nothing.
	
	ENVIRON "TEST=C:\COBOL"    ' This sets up new environment string.
	
	PRINT ENVIRON$("TEST")     ' This displays the new environment
	                           ' string.
	
	   Note that the MS-DOS environment variable names must be uppercase.
