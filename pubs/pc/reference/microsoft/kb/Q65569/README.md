---
layout: page
title: "Q65569: BC.EXE May Hang Using Single Quotation Marks in String CONST"
permalink: /pubs/pc/reference/microsoft/kb/Q65569/
---

## Q65569: BC.EXE May Hang Using Single Quotation Marks in String CONST

	Article: Q65569
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 21-SEP-1990
	
	If you use an editor other than QB.EXE to write a program and BC.EXE
	hangs at compile time, one possible cause is the use of single
	quotation marks to delimit a string literal when declaring a string
	CONST. Using single quotation marks to delimit a string constant
	rather than double quotation marks is incorrect syntax and is flagged
	by QB.EXE, but may cause the BC.EXE compiler to hang. In QuickBASIC
	version 3.00, QB.EXE will also hang as a result of using single
	quotation marks.
	
	This problem occurs in Microsoft QuickBASIC versions 3.00, 4.00,
	4.00b, and 4.50, and in Microsoft BASIC Compiler versions 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and OS/2. This problem
	was corrected in Microsoft BASIC Professional Development System (PDS)
	version 7.00 (fixlist7.00) for MS-DOS and OS/2.
	
	When the following one-line program is written with an editor other
	than QB.EXE and compiled using BC.EXE, the BC.EXE compiler will hang.
	(In QuickBASIC 3.00, QB.EXE will hang):
	
	   CONST A$ = 'Hello World'
	
	The compiler may generate the error "R6000: internal stack overflow"
	before it hangs, or it may go into an infinite loop, generating
	"R6000: Internal stack overflow" errors.
	
	To work around this problem, use the correct syntax, as follows:
	
	   CONST A$ = "Hello World"
	
	Note: The CONST statement was first introduced in QuickBASIC 3.00.
