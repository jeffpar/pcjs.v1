---
layout: page
title: "Q64108: GET from COM1 or COM2 Fails to Get Correct Data -- Use INPUT&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q64108/
---

## Q64108: GET from COM1 or COM2 Fails to Get Correct Data -- Use INPUT&#36;

	Article: Q64108
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900710-87 buglist7.00 buglist7.10
	Last Modified: 1-AUG-1990
	
	The GET statement fails to read the correct information from a
	communications port (COM1, COM2) with Microsoft BASIC Professional
	Development System (PDS) version 7.00. Characters are removed from the
	buffer, but the values read in are not the correct values sent across
	the port.
	
	To work around this problem, use the INPUT$ function to read the data
	from the COM port.
	
	Microsoft has confirmed this to be a problem with Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS and OS/2. We are researching this
	problem and will post new information here as it becomes available.
	
	This problem does NOT occur in Microsoft QuickBASIC version 4.50 or
	earlier or in Microsoft BASIC Compiler version 6.00b or earlier.
	
	Code Example
	------------
	
	The following program attempts to read characters from COM1 using both
	GET and INPUT$:
	
	   DIM a AS STRING * 1, b AS STRING * 1
	   OPEN "COM1:300,n,8,1" FOR RANDOM AS #1
	   GET #1, , a
	   b = INPUT$(1, 1)
	   PRINT a, b
	   END
	
	In QuickBASIC 4.50, both the GET and INPUT$ statements return the
	correct values, but in BASIC PDS 7.00 and 7.10, only INPUT$ returns
	the correct data while GET returns meaningless data.
