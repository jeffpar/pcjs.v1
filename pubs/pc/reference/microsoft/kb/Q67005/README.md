---
layout: page
title: "Q67005: OS/2 Graphics Functions May Fail on 8514/A Display Adapter"
permalink: /pubs/pc/reference/microsoft/kb/Q67005/
---

## Q67005: OS/2 Graphics Functions May Fail on 8514/A Display Adapter

	Article: Q67005
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a 8514A
	Last Modified: 18-NOV-1990
	
	The graphics functions in GRTEXTP.OBJ provided for OS/2 in Microsoft C
	version 6.00 do not properly recognize the 8514/A display adapter when
	setting video modes. This results in the inability to set the number
	of text rows to certain values.
	
	If the 8514/A display is set to 50-line mode, an attempt to use
	_settextrows() to set the number of rows to 43 will fail. If the
	screen is set to 25- or 43-line mode, the call to _settextrows() will
	succeed, but the screen may only be in 25-line mode.
	
	To view this problem, use the SORTDEMO program supplied as an example
	with the C 6.00 package. This program tries to put the screen in
	43-line mode.
	
	Compile SORTDEMO.C for OS/2 as described in the comments at the top of
	the file. Type MODE CO80,50 at the OS/2 command-prompt to put the
	screen in 50-line mode, then run the program. The program will cause a
	general protection violation (GP fault). If you type MODE CO80,25, the
	program will run but it will only detect CGA equivalent video, and
	therefore, will only run in 25-line mode.
	
	Microsoft has confirmed this to be a problem in C version 6.00. This
	problem has been corrected in C version 6.00a.
