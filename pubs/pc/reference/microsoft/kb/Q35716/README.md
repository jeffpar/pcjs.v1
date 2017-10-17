---
layout: page
title: "Q35716: INPUT Hercules Cursor 2 Pixels High in GWBASIC, 1 in QB 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q35716/
---

## Q35716: INPUT Hercules Cursor 2 Pixels High in GWBASIC, 1 in QB 4.50

	Article: Q35716
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 14-DEC-1989
	
	When executing an INPUT or LINE INPUT statement in QuickBASIC Version
	4.00 or in Microsoft GW-BASIC Version 3.20, 3.22, or 3.23 on a machine
	with a Hercules monochrome adaptor, the prompt (cursor) is 2 pixels
	high.
	
	However, the cursor is only 1 pixel high on a Hercules monochrome
	adaptor for the INPUT or LINE INPUT statement in QuickBASIC Version
	4.00b and 4.50, in Microsoft BASIC Compiler Versions 6.00 and 6.00b
	for MS-DOS, and in Microsoft BASIC PDS Version 7.00 for MS-DOS. This
	is behavior is by design.
	
	On CGA, EGA, VGA, or other nonmonochrome systems, the INPUT and LINE
	INPUT cursor always defaults to one pixel high in all of the product
	versions mentioned in this article.
	
	You can use the LOCATE statement to change the cursor height if desired,
	as shown in the following example:
	
	LOCATE 1,1,,10,12  ' Scan lines 10 through 12 define cursor height.
	INPUT a$
	
	This article assumes that you are in SCREEN 0 (text mode).
	
	Try running the following code on a Hercules adaptor in GW-BASIC, and
	compare the starting (default) cursor height to QuickBASIC 4.00b or
	4.50. GW-BASIC defaults to a 2-pixel cursor height, QuickBASIC 4.00b or
	4.50 defaults to a 1-pixel cursor height.
	
	Code Example
	------------
	
	CLS
	INPUT x  ' This first INPUT shows default cursor height.
	LOCATE 1, 1, , 10, 10
	INPUT x  ' Compare with a one-pixel high cursor.
	LOCATE 1, 1, , 10, 11
	INPUT x  ' Compare with a two-pixel high cursor.
	LOCATE 1, 1, , 10, 12
	INPUT x  ' Compare with a three-pixel high cursor.
