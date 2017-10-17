---
layout: page
title: "Q59398: PRINT Ignored After PRINT CURRENCY Variable in QBX.EXE 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q59398/
---

## Q59398: PRINT Ignored After PRINT CURRENCY Variable in QBX.EXE 7.00

	Article: Q59398
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	The program below demonstrates a problem with executing a PRINT
	statement to produce a blank line.
	
	After printing a variable or array element that has been dimensioned
	as a CURRENCY data type, a blank line cannot be produced by issuing a
	successive PRINT. This problem occurs only within the QBX.EXE
	environment, and does not occur with programs compiled with BC.EXE.
	
	Microsoft has confirmed this to be a problem in the QBX.EXE
	environment of Microsoft BASIC Professional Development System (PDS)
	version 7.00 for MS-DOS. This problem was corrected in BASIC PDS
	version 7.10.
	
	Code Example
	------------
	
	   DIM A AS CURRENCY
	   A = 10
	   PRINT A
	   PRINT
	   PRINT "Where did the space go?"
	   END
	
	Output
	------
	
	   10
	   Where did the space go?
	
	Workaround Code Example
	-----------------------
	
	Each additional PRINT statement will correctly produce a blank line,
	as shown in the following program:
	
	   DIM A AS CURRENCY
	   A = 10
	   PRINT A
	   PRINT
	   PRINT
	   PRINT "A blank line was printed"
	
	Output
	------
	
	   10
	
	   A blank line was printed
