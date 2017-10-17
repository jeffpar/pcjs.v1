---
layout: page
title: "Q35654: &quot;Bad Record Length&quot; if PUT#1,,x&#36; where x&#36; Length = Buffer Size"
permalink: /pubs/pc/reference/microsoft/kb/Q35654/
---

## Q35654: &quot;Bad Record Length&quot; if PUT#1,,x&#36; where x&#36; Length = Buffer Size

	Article: Q35654
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	The following information about random file I/O with a variable-length
	string as the third parameter to a GET or PUT was taken from the
	UPDATE.DOC file for QuickBASIC Version 4.00b:
	
	   "The PUT statement encodes the length of the string and
	    stores it as the first two bytes of the string. The GET
	    statement uses this encoded value to determine how many
	    characters to read."
	
	This behavior of PUT and GET applies to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b and for MS-DOS and MS OS/2, to Microsoft
	QuickBASIC Versions 4.00b and 4.50 for MS-DOS, and to Microsoft BASIC
	PDS Version 7.00 for MS-DOS and MS OS/2.
	
	This behavior of PUT and GET is different than in QuickBASIC Version
	4.00, where the string length is not recorded by PUT or used by GET.
	This behavior only applies to variable-length strings, not
	fixed-length strings. The third argument of the PUT and GET statements
	was introduced in QuickBASIC Version 4.00, and is not found in earlier
	versions.
	
	Note: You will get a "Bad Record Length" error at run time in a
	QuickBASIC Version 4.00b or 4.50 program that uses a variable-length
	string with a length equal to the record length of the OPENed
	random-file buffer as the third parameter of the PUT statement.
	Because the two-byte string length is written to the file in addition
	to the string itself, the record length specified in the "LEN=" clause
	in the OPEN statement must be at least two bytes longer than the
	variable-length string used as the third argument in a PUT.
	
	Using a third parameter on the PUT or GET statement is not supported
	in versions of QuickBASIC earlier than Version 4.00.
	
	When you PUT with a third parameter in a QuickBASIC Version 4.00
	program, the length of the string variable is not written; thus you
	can PUT a string that is equal in length to the random-file buffer
	size without error. However, to ensure compatibility with later
	versions, you should add two bytes to the OPENed random-file buffer
	size.
	
	The following example works in QuickBASIC Version 4.00, but gives a
	"Bad Record Length" error at run time if compiled in QuickBASIC
	Version 4.00b or 4.50, or in Microsoft BASIC Compiler Version 6.00,
	6.00b or 7.00:
	
	OPEN "junk.dat" FOR RANDOM AS #1 LEN = 15
	FOR k = 1 TO 5   'The following string is 15 characters long:
	   a$ = "123456789012345"
	   PUT #1, k, a$
	NEXT k
	
	The following example, which adds two to the record-length value in
	the LEN= clause, works correctly in QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and in Microsoft BASIC Compiler Versions 6.00, 6.00b and
	7.00:
	
	OPEN "junk.dat" FOR RANDOM AS #1 LEN = 17
	FOR k = 1 TO 5   'The following string is 15 characters long:
	   a$ = "123456789012345"
	   PUT #1, k, a$
	NEXT k
	
	This technique should be used to ensure compatibility with releases
	later than Version 4.00.
	
	If you use a variable-length string as the third argument of a PUT
	statement to write to a random access file in QuickBASIC Version 4.00,
	then reading that record in QuickBASIC Version 4.00b or 4.50 may give
	you a "Bad Record Length for GET" error, or string input of the wrong
	length. This occurs because GET in QuickBASIC Versions 4.00b and 4.50
	interprets the first two bytes after the variable-length string as the
	length, but Version 4.00 did not put the expected two bytes there. To
	work around this compatibility issue, you can modify your Version
	4.00b or 4.50 program to GET into a fixed-length string of the correct
	length.
