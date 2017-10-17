---
layout: page
title: "Q67206: OS/2 &quot;Path/File Access Error&quot; Instead of &quot;Permission Denied&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q67206/
---

## Q67206: OS/2 &quot;Path/File Access Error&quot; Instead of &quot;Permission Denied&quot;

	Article: Q67206
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S901024-38 buglist6.00 buglist6.00b buglist7.00 buglist7
	Last Modified: 5-DEC-1990
	
	When attempting to open a file under multiple OS/2 processes or in an
	OS/2 networking environment, a BASIC program will incorrectly generate
	the error message "Path/File access error" (error code 75) when
	attempting to open a locked file. The error message it should generate
	is "Permission denied" (error code 70). This problem does not occur in
	a DOS networking environment, such as when accessing files on a server
	from a DOS LANMAN workstation. Under these conditions, the BASIC
	program generates the correct error message, "Permission denied."
	
	This problem occurs in Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2, and in Microsoft BASIC PDS (Professional
	Development System) versions 7.00 and 7.10 for MS OS/2. Microsoft is
	researching this problem and will post new information here as it
	becomes available.
	
	The following test program demonstrates the problem. To reproduce the
	problem, compile and run the program in an OS/2 session. Then switch
	to a new session and run the same program again. The file should be
	locked for writes; the second program is supposed to terminate with a
	"Permission denied" error, but instead, displays "Path/file access
	error."
	
	Code Example
	------------
	
	OPEN "TESTFILE" FOR APPEND LOCK WRITE AS #1
	PRINT #1, "Hello"
	WHILE INKEY <> "q": WEND
