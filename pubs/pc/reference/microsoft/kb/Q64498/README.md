---
layout: page
title: "Q64498: How to Define a String Array in FIELDs in a FOR...NEXT Loop"
permalink: /pubs/pc/reference/microsoft/kb/Q64498/
---

## Q64498: How to Define a String Array in FIELDs in a FOR...NEXT Loop

	Article: Q64498
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_MQuickB B_BasicCom B_GWBasicI B_BasicInt
	Last Modified: 6-AUG-1990
	
	Below is an example of defining a string array in multiple FIELD
	statements invoked in a FOR ... NEXT loop.
	
	This information applies to all Microsoft BASIC products that support
	FIELD statements, including the following:
	
	1. Microsoft QuickBASIC version 1.00 for Apple Macintosh
	
	2. Microsoft BASIC Compiler version 1.00 for Apple Macintosh
	
	3. Microsoft BASIC Interpreter versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for Apple Macintosh
	
	4. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for MS-DOS
	
	5. Microsoft BASIC Compiler versions 5.35 and 5.36 for MS-DOS
	
	6. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	7. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2
	
	8. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	Code Example
	------------
	
	(Note: To run this program in GW-BASIC, you must add a line number to
	each line.)
	
	OPEN "test.dat" AS #1 LEN = 300
	DIM F$(30)
	i = 1
	FOR j = 1 TO 10
	FIELD #1, (j - 1) * 30 AS temp$, 10 AS F$(i), 10 AS F$(i + 1), 10 AS F$(i + 2
	i = i + 3
	NEXT
	LSET F$(30) = "1234567890"
	LSET F$(15) = "ABCDEFGHIJ"
	PUT #1, 1
	CLOSE
	
	OPEN "test.dat" AS #1 LEN = 300
	i = 1
	FOR j = 1 TO 10
	FIELD #1, (j - 1) * 30 AS temp$, 10 AS F$(i), 10 AS F$(i + 1), 10 AS F$(i + 2
	i = i + 3
	NEXT
	GET #1, 1
	PRINT F$(30), F$(15)
	
	References:
	
	For more information about alternatives to multiple FIELD statements
	in the latest Microsoft BASIC products, query for a separate article
	in this Knowledge Base using the following words:
	
	   Long and FIELD and 255
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS and MS OS/2 introduce the ability to have arrays
	in user-defined TYPEs, which allows you to write an array to disk all
	at once. For more information, query for a separate article in this
	Knowledge Base using the following words:
	
	   RANDOM and BINARY and PUT and Array and TYPE
