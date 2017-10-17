---
layout: page
title: "Q42948: Compiled INPUT Doesn't Read Text Previously PRINTed on Screen"
permalink: /pubs/pc/reference/microsoft/kb/Q42948/
---

## Q42948: Compiled INPUT Doesn't Read Text Previously PRINTed on Screen

	Article: Q42948
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890307-84 B_BasicCom B_GWBasicI
	Last Modified: 15-DEC-1989
	
	Unlike in Microsoft GW-BASIC, the INPUT or LINE INPUT statement in
	compiled BASIC will not read text that was previously displayed on the
	screen. (Instead, you must use the SCREEN function to read existing
	text on the screen.)
	
	In compiled BASIC, if you LOCATE to an area on the screen, print text,
	LOCATE there again, and do an INPUT or LINE INPUT, then moving the
	direction keys will erase what was previously on the screen. GW-BASIC
	does not do this erase. In addition, the INPUT statement in GW-BASIC
	will read the string that was previously displayed at that position.
	
	This is a fundamental design difference between Microsoft GW-BASIC
	Interpreter (Versions 3.20, 3.22, and 3.23) and compiled BASIC.
	
	The GW-BASIC Interpreter is resident in memory when a program runs,
	and can perform the INPUT of existing text on the screen using its
	built-in editor feature. This feature is not available in compiled
	programs, which do not have resident code (overhead) allocated for
	this form of screen editing.
	
	This article applies to the following compilers:
	
	1. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	3. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2
	   and MS-DOS
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	Code Example
	------------
	
	' In GWBASIC, if you hit <ENTER> at the INPUT prompt,
	' This will print "HELLO". QuickBASIC prints nothing.
	
	LOCATE 10, 10
	PRINT "HELLO"
	LOCATE 10, 10
	INPUT A$
	PRINT A$
	END
