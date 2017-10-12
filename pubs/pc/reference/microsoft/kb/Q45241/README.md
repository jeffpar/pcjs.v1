---
layout: page
title: "Q45241: Setting a Breakpoint Highlights More Than One Line"
permalink: /pubs/pc/reference/microsoft/kb/Q45241/
---

	Article: Q45241
	Product: Microsoft C
	Version(s): 2.20
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.20
	Last Modified: 7-JUN-1989
	
	When setting a breakpoint, CodeView may highlight two or more lines of
	code when you do the following:
	
	1. Compile C program (e.g., "Hello, world") with /Zi /Od.
	
	2. Load CodeView with 50 line mode (in VGA mode) as follows:
	
	      cv /50 hello.c).
	
	3. Display mixed source and assembly.
	
	4. Move the cursor to the edit window and scroll down two or three
	   pages of start-up assembly code.
	
	5. Set and remove breakpoints at arbitrary locations. In some cases,
	   multiple lines will be highlighted and the display altered. The
	   code itself is not changed. To restore the altered display, page
	   down and then page up to the altered location.
	
	CVP does display this problem.
	
	Microsoft has confirmed this to be a problem in CodeView Version 2.20.
	We are researching this problem and will post more new as it becomes
	available.
	
	After setting a breakpoint that highlights more than one line of code,
	using the BL command will list only the one breakpoint you set.
