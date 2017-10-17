---
layout: page
title: "Q69064: Brown Screen Color Changes to Yellow After Running PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q69064/
---

## Q69064: Brown Screen Color Changes to Yellow After Running PWB

	Article: Q69064
	Version(s): 1.00 1.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_c buglist1.00 buglist1.10 remapping
	Last Modified: 6-FEB-1991
	
	After running PWB, the brown screen color changes to yellow until the
	system is rebooted or the video mode is reset.
	
	For example, if you run PWB and then run the Microsoft editor, the
	brown characters will appear yellow.
	
	To work around this problem, you can create a batch file called
	PWB.BAT. In this file, you can start PWB and then reset the video
	mode. For example:
	
	    pwb.bat
	            pwb %1 %2 %3 %4
	            mode co80,25
	
	Microsoft has confirmed this to be a problem in PWB versions 1.00 and
	1.10. We are researching this problem and will post new information
	here as it becomes available.
