---
layout: page
title: "Q42665: &quot;Bad Record Length&quot; GET#n,,x&#36; Variable-Length String from File"
permalink: /pubs/pc/reference/microsoft/kb/Q42665/
---

## Q42665: &quot;Bad Record Length&quot; GET#n,,x&#36; Variable-Length String from File

	Article: Q42665
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890222-61 B_BasicCom
	Last Modified: 14-DEC-1989
	
	The run-time error "Bad record length" occurs when a QuickBASIC
	Version 4.00b or 4.50 program uses a variable-length string as the
	third argument in a GET statement to input a string that was PUT in
	the file as a fixed-length string. This information also applies to
	Microsoft BASIC Compiler Version 6.00b for MS-DOS and MS OS/2 and
	Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	No error occurs in QuickBASIC Version 4.00 or BASIC compiler Version
	6.00 because these earlier versions don't expect a 2-byte string
	length when you input a variable-length string as the third argument
	of the GET statement. For a related article discussing PUT, query on
	the following words in this Knowledge Base:
	
	   BAD RECORD LENGTH and PUT
	
	When reading from a random file that was created using fixed-length
	strings, you should GET them using fixed-length strings also.
	
	The "Details" listed under "GET" in the QuickBASIC 4.50 QB Advisor
	on-line Help system misleadingly suggest using a variable-length
	string in the following manner:
	
	   VarStrings$ = STRING$(10, " ")
	   GET #1, , VarString$
	
	This method works in QuickBASIC Version 4.00, but not in Versions
	4.00b or 4.50.
	
	To avoid the "Bad record length" error message, use a fixed-length
	string in your GET statement or create the file using a
	variable-length string in QuickBASIC 4.00b or 4.50, BASIC compiler
	6.00b, or BASIC PDS 7.00. (Making the variable-length string 2 bytes
	longer than the original string does not correct the problem.)
	
	The following code fragment works without error in QuickBASIC Version
	4.00 or BASIC compiler 6.00, but gives a "Bad record length" error in
	QuickBASIC 4.00b or 4.50, BASIC compiler 6.00b, or BASIC PDS 7.00:
	
	REM  This fragment places information in a file.
	REM  It prompts for 8 strings to be placed in a fixed-length
	REM  string "a" and then PUT into file #1
	
	OPEN "afile.dat" FOR RANDOM AS #1 LEN = 80
	DIM a AS STRING * 80
	FOR i = 1 TO 8
	  INPUT a
	  PUT #1, , a
	NEXT i
	CLOSE #1
	
	REM  This fragment reads in the data from the file and echoes to the
	REM  screen. The strings are retrieved using the statements listed
	REM  under "GET" under the "Details" on-line Help hyperlink.
	REM  To fix the problem, make VarString$ a fixed-length string
	REM  with DIM VarString as string * 80, to replace the STRING$
	REM  statement
	
	OPEN "afile.dat" FOR RANDOM AS #1 LEN = 80
	VarStrings$ = STRING$(10, " ")
	FOR i = 1 TO 8
	  GET #1, , VarString$     'this line will give error message
	  PRINT VarString$
	NEXT i
	CLOSE #1
