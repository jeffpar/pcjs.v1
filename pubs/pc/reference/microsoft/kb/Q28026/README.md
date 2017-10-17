---
layout: page
title: "Q28026: PSET Color Argument Affect in Screen 2 Differs from BASICA"
permalink: /pubs/pc/reference/microsoft/kb/Q28026/
---

## Q28026: PSET Color Argument Affect in Screen 2 Differs from BASICA

	Article: Q28026
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 bc6PTM222 buglist4.00b buglist4.50
	Last Modified: 4-DEC-1988
	
	There is a problem mapping color values used with the PSET statement
	in Screen 2. QuickBASIC Versions 4.00, 4.00b, and 4.50 map all
	non-zero values to one. IBM BASICA maps all values less than eight to
	MOD 2 of the value and all values eight and above to MOD 1.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in the Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). We are
	researching this problem and will post new information as it becomes
	available.
