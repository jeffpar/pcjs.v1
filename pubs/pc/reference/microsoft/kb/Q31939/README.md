---
layout: page
title: "Q31939: I/O to a File OPENed as &quot;NUL&quot; or &quot;NUL.xxx&quot; Does Nothing"
permalink: /pubs/pc/reference/microsoft/kb/Q31939/
---

## Q31939: I/O to a File OPENed as &quot;NUL&quot; or &quot;NUL.xxx&quot; Does Nothing

	Article: Q31939
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_GWBasicC
	Last Modified: 21-DEC-1989
	
	BASIC will allow input from or output to the DOS null device, which is
	a file named "NUL" or "NUL.xxx" (where "xxx" can be any set of none,
	one, two, or three alphanumeric letters). The DOS null device is
	always empty when you input from it and is never created on disk when
	you write to it.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Version 6.00 for MS-DOS and MS OS/2
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and OS/2
	
	4. Microsoft GW-BASIC Interpreter Version 3.20
	
	The DOS command TYPE NUL will display nothing. The DOS command DIR NUL
	will give a "File Not Found" error. The DOS command COPY EXISTING.FIL
	NUL, which copies an existing file to the NUL device, will do nothing.
	
	The following program writes to and reads from a file called
	"NUL.DAT", which has been opened with random access. The file is never
	created on the disk, and nothing is retrieved from the file or printed
	on the screen:
	
	' If you modify the OPEN statement to open a filename other than "NUL.xxx"
	' or "NUL", then "the very first recor" and "the second record is" will
	' display on the screen:
	CLS
	OPEN "NUL.DAT" FOR RANDOM AS #1
	FIELD #1, 20 AS Var1$
	LSET Var1$ = "the very first recor"
	PUT #1, 1
	LSET Var1$ = "the second record is"
	PUT #1, 2
	GET #1, 1
	PRINT Var1$
	GET #1, 2
	PRINT Var1$
	
	The following program, which inputs from a sequential access file
	called "NUL", properly gives an "Input Past End" error at run time:
	
	OPEN "NUL" FOR INPUT AS #1
	INPUT #1, x
	PRINT x
	CLOSE
