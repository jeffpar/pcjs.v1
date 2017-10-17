---
layout: page
title: "Q57796: QBX.EXE 7.00 Editor Black &amp; White Only on PS/2 Model 60 &amp; 80"
permalink: /pubs/pc/reference/microsoft/kb/Q57796/
---

## Q57796: QBX.EXE 7.00 Editor Black &amp; White Only on PS/2 Model 60 &amp; 80

	Article: Q57796
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900111-148
	Last Modified: 20-JUN-1990
	
	The QuickBASIC Extended (QBX.EXE) environment may have problems
	displaying colors on certain IBM PS/2 models with an out-of-date 8514
	adaptor card. QBX.EXE loads and correctly runs programs that execute
	graphics in VGA SCREEN modes 12 and 13. However, the editor itself
	comes up in gray, black, and white. The only colors available under
	Display on the Options menu are gray, black, and white.
	
	This problem may be corrected by contacting IBM and updating the 8514
	adaptor card (or the BIOS chip on the card).
	
	This information applies to the QuickBASIC Extended editor (QBX.EXE)
	in Microsoft BASIC Professional Development System (PDS) version 7.00
	for MS-DOS.
	
	Microsoft Product Support Services has verified this problem on a PS/2
	model 60 that has a built-in VGA with an 8514 VGA color monitor. This
	problem was reproduced under MS-DOS version 3.30, under PC-DOS version
	3.30, and under the DOS 3.x box in IBM OS/2 version 1.20.
	
	One customer also reported this problem on a PS/2 model 80 with an
	8514A monitor. Microsoft has not confirmed this problem on a PS/2
	model 80.
	
	Another customer reported that on an IBM PS/2 Model 80 (under IBM DOS
	4.00) with an 8514 video card and an 80387 coprocessor installed, the
	QBX.EXE editor displays in monochrome. However, if the coprocessor is
	disabled (SET NO87="Coprocessor Disabled"), the QBX.EXE editor
	displays the proper colors. (No TSR or device drivers were in the
	system during this test.) Microsoft has not confirmed this report.
	
	A customer has also reported this problem on an IBM PS/2 Model 70
	using an 8515 monitor. Microsoft has not confirmed this report.
	
	To demonstrate that these color problems are due to the card, do the
	following:
	
	1. Start QBX.EXE.
	
	2. Unplug the monitor from the 8514 card.
	
	3. Plug the monitor into the VGA on the motherboard.
	
	4. Unplug the monitor and plug it back into the 8514 card, and correct
	   color now returns.
