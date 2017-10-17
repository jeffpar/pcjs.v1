---
layout: page
title: "Q27406: LINE (0,0)-(12231,12230) Causes Line Coordinates to Overflow"
permalink: /pubs/pc/reference/microsoft/kb/Q27406/
---

## Q27406: LINE (0,0)-(12231,12230) Causes Line Coordinates to Overflow

	Article: Q27406
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 17-JAN-1990
	
	A LINE graphics statement gives an Overflow Error with certain large
	(but valid) values for coordinates. The first two LINE statements of
	the example below work correctly; the third LINE statement gives the
	overflow error.
	
	This problem occurs both in the QB.EXE editor environment and as an
	.EXE file.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00, 4.00b, and 4.50, and in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and OS/2 (fixlist7.00).
	
	The code example is as follows:
	
	   screen 2
	   line (0,0)-(12230, 12230)
	   line (0,0)-(12231, 12231)
	   line (0,0)-(12231, 12230)
