---
layout: page
title: "Q63901: Incorrect SEEK in Example in BASIC 7.00 Language Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q63901/
---

## Q63901: Incorrect SEEK in Example in BASIC 7.00 Language Reference

	Article: Q63901
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900712-2 docerr
	Last Modified: 15-JAN-1991
	
	On page 323 of the "Microsoft BASIC 7.0: Language Reference" manual,
	the example for the SEEK statement (on the 6th line from the bottom)
	incorrectly shows that the process for backing up a file is as
	follows:
	
	   SEEK #1, SEEK(1) - LEN(RecordVar)
	
	This statement is the correct method for backing up one record
	position in a binary file. In a binary file, the SEEK function refers
	to a byte in the file. Therefore, to move forward or backward a
	record, you would increment or decrement by the number of bytes in
	each record of the file.
	
	However, because the file in the SEEK example on page 323 is a RANDOM
	access file, a SEEK function refers to each record in the file, not to
	each byte in the file. Thus, the statement should be corrected to read
	as follows:
	
	   SEEK #1, SEEK(1) - 1
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
