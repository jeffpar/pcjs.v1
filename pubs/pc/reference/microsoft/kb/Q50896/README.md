---
layout: page
title: "Q50896: If WIDTH 80,60 in SCREEN 12 Then PALETTE Can Give Wrong Color"
permalink: /pubs/pc/reference/microsoft/kb/Q50896/
---

## Q50896: If WIDTH 80,60 in SCREEN 12 Then PALETTE Can Give Wrong Color

	Article: Q50896
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 B_BasicCom
	Last Modified: 21-SEP-1990
	
	In SCREEN 12, if the WIDTH 80, 60 statement is used to set the screen
	to 60-line mode and then the PALETTE statement is used to set
	attributes and colors, the palette can give erroneous colors. The
	problem can be worked around by changing the WIDTH statement to
	WIDTH , 30 to set the screen to 30-line mode instead of 60.
	
	The code fragment given below demonstrates the problem in QuickBASIC
	version 4.50. The same code fragment runs correctly in QuickBASIC
	versions 4.00 and 4.00b.
	
	Microsoft has confirmed this to be a problem in QuickBASIC version
	4.50 and in Microsoft BASIC Professional Development System (PDS)
	version 7.00 (buglist7.00). This problem was corrected in BASIC PDS
	version 7.10 (fixlist7.10).
	
	The program below reproduces the problem on SCREEN 12, which requires
	a VGA. It should produce bands of shades of gray going from black to
	white across the screen. Instead, it produces bands of the same set of
	incorrect colors each time it is run.
	
	   SCREEN 12
	   WIDTH 80, 60            'WIDTH 80, 30 gives correct results
	   FOR X = 4 TO 60 STEP 4
	       A& = 65536 * X + 256 * X + X
	       B = X / 4
	       PALETTE B, A&
	   NEXT
	   FOR X = 1 TO 16
	       LINE (X * 10, 0)-(X * 10 + 20, 350), X, BF
	   NEXT
