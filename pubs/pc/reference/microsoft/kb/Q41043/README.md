---
layout: page
title: "Q41043: No Warning If GET or SEEK Past End of Random File; Use EOF(n)"
permalink: /pubs/pc/reference/microsoft/kb/Q41043/
---

## Q41043: No Warning If GET or SEEK Past End of Random File; Use EOF(n)

	Article: Q41043
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890203-60
	Last Modified: 14-DEC-1989
	
	When reading a random access file with the GET statement, if you GET
	or SEEK beyond the number of existing records, then no "END OF FILE"
	error occurs. The records that GET reads after the end of a random
	file are simply blank or set to zero. To avoid this behavior, you must
	do either of the following:
	
	1. Test the value (true or false) of the EOF(n) function after every
	   GET or SEEK statement to determine if you have reached the end of
	   the random access file.
	
	OR
	
	2. Calculate the number of records in the random access file by
	   dividing the number of bytes returned from the LOF(n) function by
	   the length (in bytes) of each record. You can then design your
	   program to GET or SEEK up to, but not greater than, the number
	   of records in the file.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	Microsoft BASIC PDS Version 7.00.
	
	When working with files OPENed in RANDOM mode, you can use the
	following steps together to avoid running past the end of the file:
	
	1. Check the value of the EOF(n) function after every SEEK or GET
	   for file number n. If EOF(n) returns -1 (a logical value of true)
	   for a random access file, then the last executed GET statement
	   was unable to read an entire record (which happens when reading
	   past the end of the file).
	
	2. The LOF(n) function returns the length of file number n.
	
	3. The LEN= clause of the OPEN statement specifies the record length
	   for input from a random file.
	
	4. The SEEK and GET statements set the next location to read in the
	   file.
	
	5. The SEEK(n) and LOC(n) functions return your current location
	   in file number n.
	
	6. The GET statement accepts input into a FIELDed buffer or directly
	   into a variable specified as the third argument of the GET.
	
	The following is a code example:
	
	(This example demonstrates how to check the value of the EOF function
	after every GET.)
	
	' Create a file with RANDOM access as follows:
	CLS
	OPEN "junk2" FOR RANDOM AS #1 LEN = 10
	FIELD #1, 10 AS x$
	LSET x$ = "1234567890"
	FOR i = 1 TO 5
	   PUT #1, i
	NEXT
	CLOSE
	
	' Input from the existing RANDOM file as follows:
	OPEN "junk2" FOR RANDOM AS #1 LEN = 10
	FIELD #1, 10 AS x$
	i=0
	DO
	   i=i+1
	   GET #1, i
	   IF EOF(1) THEN EXIT DO  ' Exit GET loop when end of file.
	   PRINT i, x$
	LOOP
	CLOSE
