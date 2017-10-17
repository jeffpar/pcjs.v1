---
layout: page
title: "Q37897: INPUT Statement Removes Unquoted Leading &amp; Trailing Spaces"
permalink: /pubs/pc/reference/microsoft/kb/Q37897/
---

## Q37897: INPUT Statement Removes Unquoted Leading &amp; Trailing Spaces

	Article: Q37897
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_QuickBas B_GWBasicI B_BasicInt B_BBasic
	Last Modified: 12-JAN-1990
	
	In all versions of Microsoft BASIC, the INPUT statement will remove
	leading and trailing spaces without quotation marks from an input
	string. The following two processes will help you work around this
	behavior:
	
	1. Put double quotation marks around the input string.
	
	2. Use LINE INPUT into a string variable.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	3. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	5. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	6. Microsoft BASIC Compiler and Interpreter for the XENIX Operating
	   System
	
	7. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh
	
	8. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	9. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
	
	The following is a code example:
	
	' Run this program and input the following with leading and
	' trailing spaces:       test
	INPUT X$
	PRINT X$,LEN(X$)
	' You must surround leading and trailing spaces in your input with
	' double quotation marks to make them significant: "    test    "
	' or else use LINE INPUT:
	LINE INPUT X$
