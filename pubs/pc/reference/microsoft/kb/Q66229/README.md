---
layout: page
title: "Q66229: Situation Where PWB Online Help Text Disappears"
permalink: /pubs/pc/reference/microsoft/kb/Q66229/
---

	Article: Q66229
	Product: Microsoft C
	Version(s): 1.00 1.10 | 1.00 1.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901010-118 B_BasicCom S_C B_cobol
	Last Modified: 24-OCT-1990
	
	When requesting help in Microsoft Programmer's WorkBench (PWB)
	versions 1.00 and 1.10, the following sequence of events will cause
	the Help screen text to disappear, leaving only the hyperlinks.
	
	This information applies to Programmer's WorkBench version 1.00 (which
	comes with Microsoft C Professional Development System version 6.00
	for MS-DOS and MS OS/2), and to Programmer's WorkBench version 1.10
	(which comes with Microsoft COBOL Professional Development System
	version 4.00 and with Microsoft BASIC Professional Development System
	(PDS) version 7.10 for MS-DOS and MS OS/2).
	
	Microsoft has confirmed this to be a problem in PWB. We are
	researching this problem and will post new information here as it
	becomes available.
	Follow these steps to reproduce the problem:
	
	1. From the DOS or OS/2 prompt, enter PWB. From the File menu, select
	   New. Type PLINES and request help by pressing F1 or single-clicking
	   the right mouse button.
	
	2. In the Help dialog, double-click the left mouse button with the
	   cursor on the hyperlink "Using PWB Functions."
	
	3. Double-click the left mouse button with the cursor on the hyperlink
	   "PWB Functions by Category."
	
	4. Double-click the left mouse button with the cursor on the hyperlink
	   "Moving Through Files."
	
	5. The vertical scroll bar will show that you are at the bottom of the
	   dialog. Press PGUP and you will notice that the hyperlinks to Up,
	   Index, Contents, and Back have disappeared. Double-click the left
	   mouse button with the cursor on any of these empty hyperlinks; the
	   text on the screen will disappear, with empty hyperlinks appearing
	   on the screen.
