---
layout: page
title: "Q33707: &quot;Error R6000: Stack Overflow&quot; in Non-Stand-Alone Program"
permalink: /pubs/pc/reference/microsoft/kb/Q33707/
---

## Q33707: &quot;Error R6000: Stack Overflow&quot; in Non-Stand-Alone Program

	Article: Q33707
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 7-FEB-1989
	
	When certain programs that are heavily laden with $INCLUDE statements
	are compiled in BC.EXE without the /O option (not stand-alone), the
	following run-time error can repeatedly display on the screen for
	about 20 seconds, and then the computer can hang:
	
	   R6000:Stack Overflow
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00b and 4.50, and in the Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). We
	are researching this problem and will post new information as it
	becomes available.
	
	The current workaround is to reduce the number of $INCLUDE statements.
	
	With QuickBASIC Version 4.00b and BASIC Compiler 6.00 and 6.00b, the
	problem usually does not occur if you compile with the BC /O
	(stand-alone) option. However, the error message occurs for both
	stand-alone and non-stand-alone programs with QuickBASIC Version 4.50.
	
	This problem does not occur in QuickBASIC Versions 4.00 or earlier.
