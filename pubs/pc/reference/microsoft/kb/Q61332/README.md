---
layout: page
title: "Q61332: Storage Format for MKI&#36;, MKL&#36;, MKS&#36;, MKD&#36; Same as Variable"
permalink: /pubs/pc/reference/microsoft/kb/Q61332/
---

## Q61332: Storage Format for MKI&#36;, MKL&#36;, MKS&#36;, MKD&#36; Same as Variable

	Article: Q61332
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900403-6 B_BasicCom
	Last Modified: 29-JAN-1991
	
	The MKS$, MKI$, MKL$, and MKD$ functions are used in Microsoft
	QuickBASIC to convert numeric data to strings for use in random access
	files. The actual conversion of the numbers to strings is just a
	transfer of the binary representation of the number. If you look at a
	binary representation of both a numeric variable and the string
	equivalent made with the MKS$, MKI$, MKL$, or MKD$ function, you will
	see that they are exactly the same (with the exception of MKS$ and
	MKD$ when compiling with the /MBF option).
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b, and to
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10. Note that BASIC PDS also provides MKC$, for the CURRENCY
	data type.
	
	The binary numeric format stored in numeric variables versus MKS$ or
	MKD$ strings differs if you invoke the QuickBASIC environment (QB.EXE
	or QBX.EXE) or the BC.EXE compiler with the /MBF option (which makes
	MKS$ and MKD$ behave just like the MKSMBF$ and MKDMBF$ functions). The
	/MBF (Microsoft Binary Format) option makes MKS$ and MKD$ return MBF
	strings instead of IEEE format strings.
	
	Code Sample
	-----------
	
	Both the integer and the string equivalent in the following program
	are stored in 2 bytes in memory. This program prints out the numeric
	value of the binary content of the locations that A% and A$ are kept
	in. As the output of this program demonstrates, the binary
	representation of the two values is the same.
	
	This program prints a series of numbers both as decimal numbers and as
	their MKI$ equivalent. Then it prints out the information stored in
	the 2-byte locations in memory for both the numeric and string data.
	When you run the program, note the difference in the binary storage of
	the numbers when the value increments from 255 to 256 (requiring a bit
	in the higher byte).
	
	CLS
	FOR a% = 252 TO 259
	  a$ = MKI$(a%)
	  PRINT "Number:"; a%, "String: "; a$
	  aseg = VARSEG(a%)
	  aptr = VARPTR(a%)
	  asseg = VARSEG(a$)
	  asptr = SADD(a$)
	  DEF SEG = aseg
	  aval1 = PEEK(aptr): aval2 = PEEK(aptr + 1)
	  DEF SEG = asseg
	  asval1 = PEEK(asptr): asval2 = PEEK(asptr + 1)
	  PRINT aval1, aval2, , asval1, asval2
	NEXT a%
