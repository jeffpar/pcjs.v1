---
layout: page
title: "Q43266: QB/H Not Reset to 25-Line Mode After Using Make EXE And Exit"
permalink: /pubs/pc/reference/microsoft/kb/Q43266/
---

## Q43266: QB/H Not Reset to 25-Line Mode After Using Make EXE And Exit

	Article: Q43266
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 26-FEB-1990
	
	The QuickBASIC environment can be invoked with the /H option, which
	enables the highest line mode supported by the video card. If QB.EXE
	is invoked with the /H option from MS-DOS while in 25-line mode, and a
	normal exit from the environment is performed (by pressing ALT+F X),
	then the video mode is reset to 25-line mode upon returning to MS-DOS.
	
	If an exit is performed using the Run menu's Make EXE And Exit
	command, the video mode is properly reset to 25-line mode during the
	compilation and LINKing process, but upon completion, the video mode
	is reset to 43-line mode.
	
	Microsoft has confirmed this to be a problem with QuickBASIC Versions
	4.00, 4.00b, and 4.50, and with the QB.EXE included with Microsoft
	BASIC Compiler Versions 6.00 and 6.00b (buglist6.00, buglist6.00b).
	This problem was corrected in Microsoft BASIC Professional Development
	System (PDS) Version 7.00 (fixlist7.00).
