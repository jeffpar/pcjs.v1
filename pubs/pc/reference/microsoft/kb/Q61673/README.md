---
layout: page
title: "Q61673: &quot;Illegal Function Call&quot; with TAB &amp; LOCATE in Compiled Program"
permalink: /pubs/pc/reference/microsoft/kb/Q61673/
---

## Q61673: &quot;Illegal Function Call&quot; with TAB &amp; LOCATE in Compiled Program

	Article: Q61673
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900417-103 B_BasicCom buglist4.50
	Last Modified: 11-MAY-1990
	
	This article documents a special case where the TAB function placed
	between two LOCATE statements causes an "Illegal Function Call" in a
	subroutine. This problem occurs only in a compiled (.EXE) program
	using QuickBASIC version 4.50.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	version 4.50. This problem was corrected in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS
	(fixlist7.00).
	
	This problem does not occur in Microsoft QuickBASIC versions 4.00 or
	4.00b or in Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS.
	
	The problem does not occur if you do one or both of the following:
	
	1. Remove the TAB function from between the Locate statements. Instead
	   of TAB, use a literal such as "     " with the appropriate number of
	   spaces, or use the STRING$() function.
	
	2. Compile with /x.
	
	Code Example
	------------
	
	   ' Compile line: BC tab.bas;
	   ' Link line:    LINK tab ;
	
	   DECLARE SUB test (col)
	   CALL test(20)
	
	   SUB test (col)
	       LOCATE col, 1
	       PRINT TAB(2);
	       LOCATE col, 1     'This line gives the "Illegal Function call"
	   END SUB
