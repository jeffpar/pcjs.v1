---
layout: page
title: "Q35357: BLOAD Can Fail with Older Monochrome Cards; Newer Cards OK"
permalink: /pubs/pc/reference/microsoft/kb/Q35357/
---

## Q35357: BLOAD Can Fail with Older Monochrome Cards; Newer Cards OK

	Article: Q35357
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-FEB-1991
	
	On older monochrome cards, BLOAD may not work correctly. The symptoms
	are that BLOAD displays only the first four lines of the screen and
	then garbage or nothing else. These symptoms are caused by a problem
	in the monochrome card. Updating the monochrome display card should
	solve the problem.
	
	With Microsoft QuickBASIC versions 4.00 and 4.00b and Microsoft BASIC
	Compiler versions 6.00 and 6.00b, the problem occurs when loading
	either text (SCREEN 0) or graphics (Hercules SCREEN 3) with BLOAD. One
	customer also reported this behavior for Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10.
	
	Code Example
	------------
	
	'Note that this problem can also occur in screen 0:
	DEF SEG = &HB000   ' &HB000 is starting paragraph of monochrome memory
	SCREEN 3, , 0, 0
	LINE (100, 100)-(300, 300)
	BSAVE "test.img", 0, &H8000  ' &H8000 hex is 32,767 decimal
	CLS
	BLOAD "test.img", 0
