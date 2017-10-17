---
layout: page
title: "Q39380: GET with BINARY File Fills String with NULL Bytes at EOF"
permalink: /pubs/pc/reference/microsoft/kb/Q39380/
---

## Q39380: GET with BINARY File Fills String with NULL Bytes at EOF

	Article: Q39380
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881214-12
	Last Modified: 21-DEC-1988
	
	Using the GET #n statement with a file that has been opened for BINARY
	will fill the last bytes of an existing input string (which is the
	third parameter of GET) with NULLs. This only occurs if the length of
	the existing string exceeds the number of bytes between the file
	pointer (before the GET) and the end of file. This behavior applies to
	both fixed-length and variable-length string variables.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, and to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2. (Earlier versions do not have a third parameter for
	the GET#n statement, and are not affected.)
	
	The example program below demonstrates how this occurs. If TestString$
	= "123456789012345" and TEST.DAT is a text file OPENed in BINARY
	containing only the string "TEST", the following GET statement will
	alter TestString$ such that it contains the string "TEST" and 11 NULL
	bytes.
	
	The following is a code example:
	
	CLS
	OPEN "TEST.DAT" FOR BINARY AS #1
	TestString$ = "123456789012345"
	PRINT "ASCII dump of string BEFORE GET from small file"
	FOR i = 1 TO 15: PRINT ASC(MID$(TestString$, i, 1)); : NEXT i
	GET #1, 1, TestString$   ' This GET requires QuickBASIC 4.x
	PRINT "ASCII dump of string AFTER GET from small file"
	FOR i = 1 TO 15: PRINT ASC(MID$(TestString$, i, 1)); : NEXT i
	END
	
	The output is as follows:
	
	ASCII dump of string BEFORE GET from small file
	49 50 51 52 53 54 55 56 57 48 49 50 51 52 53
	ASCII dump of string AFTER GET from small file
	84 69 83 84 0 0 0 0 0 0 0 0 0 0 0
