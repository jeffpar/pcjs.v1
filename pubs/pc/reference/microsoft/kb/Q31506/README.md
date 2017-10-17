---
layout: page
title: "Q31506: Fixed-Length String Illegal in FIELD; QB.EXE Wrongly Allows It"
permalink: /pubs/pc/reference/microsoft/kb/Q31506/
---

## Q31506: Fixed-Length String Illegal in FIELD; QB.EXE Wrongly Allows It

	Article: Q31506
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 7-SEP-1989
	
	When you use a fixed-length string variable in a FIELD statement (to
	define the buffer for a RANDOM access file), the BC.EXE compiler
	correctly gives the error message "Variable-length string required."
	However, the QB.EXE editor fails to warn you against using a
	fixed-length string in FIELD statement, and the program runs and
	ignores the fixed-length string variable in the FIELD statement.
	
	Microsoft has confirmed this to be a problem in the QB.EXE editor in
	QuickBASIC Versions 4.00 and 4.00b. This problem was corrected in
	QuickBASIC Version 4.50 where the "Variable-length string required"
	error message correctly displays in the QB.EXE editor as well as when
	compiled with BC.EXE, when you attempt to use a fixed-length string
	variable in a FIELD statement.
	
	Please note that QuickBASIC Versions 3.00 and earlier don't have
	fixed-length strings.
	
	Code Example
	------------
	
	When you use the first DIM statement in the program below, QB.EXE
	fails to give an error message on the FIELD statement, and "lastname"
	is treated as a variable not connected with the FIELD statement and is
	completely ignored in the FIELD statement. The same DIM correctly
	gives a "variable length string required" error when compiled with
	BC.EXE. The code example is as follows:
	
	DIM lastname AS STRING * 6  ' Fixed-length string in FIELD is not OK.
	'DIM lastname AS STRING     ' OK, since AS STRING is variable-length.
	OPEN "Hunkfile" FOR RANDOM AS #1 LEN = 10
	FIELD #1, 6 AS lastname, 4 AS firstname$
	LSET lastname = "Cruise"
	LSET firstname$ = "Tom"
	PUT #1, 1
	LSET lastname = "Gibson"
	LSET firstname$ = "Mel"
	PUT #1, 2
	CLOSE #1
	OPEN "hunkfile" FOR RANDOM AS #1 LEN = 10
	FIELD #1, 6 AS lastname, 4 AS firstname$
	GET #1, 1
	PRINT firstname$; lastname
	GET #1, 2
	PRINT firstname$; lastname
	CLOSE #1
