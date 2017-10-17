---
layout: page
title: "Q31277: Cannot LOCK Portions of File OPENed with Binary Access File"
permalink: /pubs/pc/reference/microsoft/kb/Q31277/
---

## Q31277: Cannot LOCK Portions of File OPENed with Binary Access File

	Article: Q31277
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	The LOCK statement should lock entire files, certain records within a
	random access file, or certain bytes within a binary access file.
	
	The LOCK statement successfully locks records within a random access
	file. However, if certain bytes within a binary access file are
	locked, the whole file is locked as well. This causes a "Permission
	denied" error when trying to access any part of the binary access
	file.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem was
	corrected in QuickBASIC Version 4.50 and in the Microsoft BASIC
	Compiler Version 7.00 (fixlist7.00).
	
	To work around this problem, open binary files as random files with a
	buffer size of 1 (OPEN X$ FOR RANDOM LEN=1).
	
	Note: QuickBASIC Versions 3.00 and earlier do not offer binary access
	files; they offer only random and sequential access files.
	
	The following code example demonstrates the problem:
	
	' The DOS 3.x SHARE.EXE utility must be executed before running this
	' program. The following program creates a random file and a binary
	' file. It opens each file under two different numbers. A record in
	' the random file can be locked successfully, but the binary file is
	' completely locked.
	
	OPEN "test4" FOR RANDOM AS #2 LEN = 11  'Open same file as #3 and #2.
	OPEN "test4" FOR RANDOM AS #3 LEN = 11
	OPEN "test5" FOR BINARY AS #1  'Open the same file as #1 and as #4.
	OPEN "test5" FOR BINARY AS #4
	FIELD #3, 6 AS lastname$, 5 AS firstname$
	FIELD #2, 6 AS lastname$, 5 AS firstname$
	LOCK #2, 1                      'Lock a record in #2, but not #3.
	LOCK #1, 30 TO 32               'Lock some bytes in #1, not in #4.
	'
	a$ = "Like as the waves make toward the pebbled shore" '
	b$ = "So do our minutes hasten to their end."
	
	'
	PUT #1, , a$                         'Put some lines into "test5".
	PUT #1, , b$
	LSET lastname$ = "Martin"            'Put some stuff into "test4".
	LSET firstname$ = "Steve"
	PUT #2, 1
	LSET lastname$ = "Henry"
	LSET firstname$ = "John"
	PUT #2, 2
	GET #2, 2                             'Gets both records OK as #2.
	PRINT firstname$; lastname$
	GET #2, 1
	PRINT firstname$; lastname$
	
	GET #3, 2                             'Can get this record OK as #3.
	PRINT firstname$; lastname$
	'GET #3, 1                    'This record is properly locked to #3.
	'PRINT firstname$; lastname$
	'The following gives "Permission denied" if any part is locked by #1:
	a$ = INPUT$(4, #4)
	PRINT a$
	UNLOCK #1, 30 TO 32
	UNLOCK #2, 1
	CLOSE
