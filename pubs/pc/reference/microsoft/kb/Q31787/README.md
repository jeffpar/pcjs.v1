---
layout: page
title: "Q31787: IF &lt;expression&gt; THEN NEXT / THEN WEND Not Supported"
permalink: /pubs/pc/reference/microsoft/kb/Q31787/
---

## Q31787: IF &lt;expression&gt; THEN NEXT / THEN WEND Not Supported

	Article: Q31787
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-DEC-1989
	
	You cannot conditionally execute NEXT and WEND statements using the
	single-line IF...THEN...ELSE statement.
	
	The following two syntax examples, which are supported by GW-BASIC and
	QuickBASIC Version 2.01 and previous versions, are not supported by
	QuickBASIC Versions 3.00 and later:
	
	   IF <boolean expression> THEN NEXT
	
	   IF <boolean expression> THEN WEND
	
	Using this illegal syntax will give the following error message at
	compile time:
	
	   "NEXT without FOR" or "WEND without WHILE"
	
	This situation is documented in the following manuals:
	
	1. Page 272 of the "Microsoft QuickBASIC 4.00: Learning and Using"
	   manual.
	
	2. Page 272 of the "Microsoft BASIC Compiler Version 6.00 for MS-DOS
	   and OS/2: Learning and Using QuickBASIC"
	
	3. Gray Page Update-57 of the "Microsoft QuickBASIC Version 3.00
	   Update" manual.
