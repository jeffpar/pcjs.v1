---
layout: page
title: "Q28035: &quot;String Space Corrupt&quot; After CLEARing a Watch String"
permalink: /pubs/pc/reference/microsoft/kb/Q28035/
---

## Q28035: &quot;String Space Corrupt&quot; After CLEARing a Watch String

	Article: Q28035
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	In the QB.EXE debugger, set a WATCH on A$ and then execute the
	following program with SHIFT+F5. The program will produce a "String
	Space Corrupt" error:
	
	   A$="TEST"
	   CLEAR
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS (buglist6.00, buglist6.00b). This problem was
	corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
