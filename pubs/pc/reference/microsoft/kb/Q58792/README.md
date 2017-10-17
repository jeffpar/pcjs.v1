---
layout: page
title: "Q58792: PCOPY Can Fail from Page 0 in 43-Line Mode in SCREEN 0"
permalink: /pubs/pc/reference/microsoft/kb/Q58792/
---

## Q58792: PCOPY Can Fail from Page 0 in 43-Line Mode in SCREEN 0

	Article: Q58792
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900214-56 buglist7.00 fixlist7.10
	Last Modified: 6-AUG-1990
	
	In Microsoft BASIC Professional Development System (PDS) version 7.00,
	when in 43-line mode in SCREEN mode 0, using a PCOPY statement to copy
	screen page 0 to some other screen page may fail. If screen page 0 is
	both the visual and active page during the PCOPY statement, it copies
	corrupt information to the other screen page. This problem occurs only
	in SCREEN mode 0 when in 43-line mode and only when PCOPYing from page
	0. It does not occur when PCOPYing from another page to page 0.
	Temporarily setting the active and/or visual page to a screen page
	other than 0 during the PCOPY corrects the problem.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	version 7.00 for MS-DOS. This problem was corrected in BASIC PDS
	version 7.10.
	
	The following program demonstrates the problem. A string of 3440 X's
	that fills the screen is displayed, then copied from page 0 to page 1.
	The visual page is then set to page 1 to view the information copied
	from page 0. What appears in page 1 is only a few lines of text,
	either at the top or middle of the screen. Setting either the visual
	and/or active screen page to any page other than page 0 corrects the
	problem.
	
	   WIDTH 80, 43
	   PRINT STRING$(3440, "X");
	   'SCREEN , ,0, 1    'Uncommenting this line corrects the problem
	   PCOPY 0, 1
	   LOCATE 10, 10: PRINT " HIT ANY KEY TO SWITCH PAGES "
	   SLEEP
	   SCREEN , ,0, 1
	   END
