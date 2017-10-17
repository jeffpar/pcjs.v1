---
layout: page
title: "Q30402: INPUT Receives Nonzero Value When &quot;&amp;&quot; Character Is Input"
permalink: /pubs/pc/reference/microsoft/kb/Q30402/
---

## Q30402: INPUT Receives Nonzero Value When &quot;&amp;&quot; Character Is Input

	Article: Q30402
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 31-JAN-1990
	
	When you INPUT the ampersand (&) character into a numeric variable,
	the value input is nonzero. This result occurs in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2.
	
	Receiving the ampersand character in an INPUT statement should return
	zero, because the ampersand character denotes a long-integer constant.
	However, this character does not return zero.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2 (fixlist7.00).
	
	In the QB.EXE environment, a value of 203 is received when the
	ampersand character is INPUT. When running the same program from an
	EXE file, the value 233 is received. In an EXE program compiled with
	Microsoft BASIC Compiler Versions 6.00 and 6.00b, the value 259 is
	received.
	
	The INPUT statement correctly inputs a zero into a numeric variable
	when you input the ampersand character in QuickBASIC Version 3.00, or
	in BASIC PDS 7.00.
	
	The following is a code example:
	
	   INPUT "Enter an integer : ", I%     ' Type in & character.
	   PRINT I%
