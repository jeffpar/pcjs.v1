---
layout: page
title: "Q27097: How to Obtain Upper and Lower Bytes of an Integer"
permalink: /pubs/pc/reference/microsoft/kb/Q27097/
---

## Q27097: How to Obtain Upper and Lower Bytes of an Integer

	Article: Q27097
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	The following program demonstrates how to obtain the upper and lower
	bytes of an integer. The following is sample code:
	
	CLS
	a% = &HA0B0
	ah% = (a% AND &HFF00) \ 256 AND &HFF   'Note: "\" means integer division
	al% = a% AND &HFF
	PRINT HEX$(ah%)                 'Prints upper bytes: A0
	PRINT HEX$(al%)                 'Prints lower bytes: B0
	
	This information applies to Microsoft QuickBASIC 4.00 4.00B and 4.50
	for MS-DOS, to Microsoft BASIC Compiler 6.00 and 6.00B for MS-DOS and
	MS OS/2, and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS
	OS/2.
