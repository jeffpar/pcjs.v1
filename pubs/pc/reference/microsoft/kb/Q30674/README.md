---
layout: page
title: "Q30674: Hercules SCREEN: PAINT Overspills Window after VIEW and CIRCLE"
permalink: /pubs/pc/reference/microsoft/kb/Q30674/
---

## Q30674: Hercules SCREEN: PAINT Overspills Window after VIEW and CIRCLE

	Article: Q30674
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 5-DEC-1989
	
	The code below should PAINT a 90-degree slice of a disk on Hercules
	SCREEN 3. With certain coordinates given to the PAINT statement, the
	entire VIEW rectangle is incorrectly filled.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50.
	
	The problem occurs both as an .EXE and inside the QB.EXE environment.
	
	The following is a code example:
	
	   SCREEN 3
	   VIEW (1, 1)-(100, 100)
	   CIRCLE (100, 100), 50
	   'PAINT (95, 95) This correctly gives quarter-disk.
	   PAINT(96,96) 'Incorrectly gives rectangle
