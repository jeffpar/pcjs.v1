---
layout: page
title: "Q57501: QBX May Incorrectly Parse Array Element in User-Defined TYPE"
permalink: /pubs/pc/reference/microsoft/kb/Q57501/
---

## Q57501: QBX May Incorrectly Parse Array Element in User-Defined TYPE

	Article: Q57501
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	The QuickBASIC Extended editor (QBX.EXE), which is shipped with
	Microsoft BASIC Professional Development System (PDS) version 7.00 for
	MS-DOS, incorrectly parses a line of code that uses incorrect syntax
	for an array element in a user-defined TYPE. The following is an
	example:
	
	   TYPE abc
	      a(1 to 10) AS STRING * 8
	   END TYPE
	   DIM y AS abc
	   PRINT y.a$(3)
	
	When you enter the last line into QBX.EXE and press the ENTER key,
	the line is interpreted (parsed) incorrectly and is displayed
	incorrectly as follows:
	
	   3yGOTO
	
	If the correct line of code "PRINT y.a(3)" is entered, the code is
	interpreted correctly.
	
	Microsoft has confirmed this to be problem in the QBX.EXE editor in
	Microsoft BASIC PDS version 7.00. This problem was corrected in
	QBX.EXE in BASIC PDS 7.10.
	
	This problem relates only to QBX.EXE and does not relate to the BC.EXE
	compiler in BASIC 7.00.
