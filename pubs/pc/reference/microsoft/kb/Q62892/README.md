---
layout: page
title: "Q62892: &quot;Out of Stack Space&quot; with ON ERROR, REDIM, GOSUB, Then ERASE"
permalink: /pubs/pc/reference/microsoft/kb/Q62892/
---

## Q62892: &quot;Out of Stack Space&quot; with ON ERROR, REDIM, GOSUB, Then ERASE

	Article: Q62892
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist7.00 buglist7.10 SR# S900603-4
	Last Modified: 6-AUG-1990
	
	When compiled with the Far Strings option (BC /FS) and run as a .EXE
	program, the program below results in the message "Out of stack space
	in line 4." This problem does not occur when the program is run in the
	QBX.EXE environment or when it is compiled with the Near Strings
	option and run. It also does not occur when lines 1 and 9 are removed,
	when line 4 is removed, or when the number of arrays erased is
	decreased by one or more.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	Code Example
	------------
	
	   1 ON ERROR GOTO 9
	   2 FOR i% = 1 TO 100
	   3   REDIM a$(1), b$(1), c$(1)
	   4   GOSUB 8
	   5   ERASE a$, b$, c$
	   6 NEXT i%
	   7 END
	   8 RETURN
	   9 RESUME
