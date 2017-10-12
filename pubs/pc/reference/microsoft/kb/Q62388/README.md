---
layout: page
title: "Q62388: PWB Doesn't Update Mark Location If Mark Moves Up or Left"
permalink: /pubs/pc/reference/microsoft/kb/Q62388/
---

	Article: Q62388
	Product: Microsoft C
	Version(s): 1.00 | 1.00
	Operating System: OS/2 | 1.00
	Flags: ENDUSER | buglist1.00
	Last Modified: 13-JUN-1990
	
	If you set a mark in a file, and that location then moves upward or
	toward the left in the file, PWB does not reset the mark location;
	however, it does correctly update marks that move downward or to the
	right in the file.
	
	Consider the following file:
	
	/* Test.dat */
	test1
	
	test2
	
	test3
	
	Place the cursor on the "2" in test2. Choose the Search.Define Mark
	menu option. Name the mark "mark1" and press ENTER. Now, move the
	cursor to another location in the file. Choose the Search.Go To Mark
	option from the menus. Go to "mark1". Note that the cursor is back on
	the "2" in test2.
	
	Next, add another blank line between test1 and test2. Again, move your
	cursor and go to mark1. Note that the cursor is back on the "2" in
	test2.
	
	Now, delete both the lines between test1 and test2. Select the
	Search.Go To Mark option from the menus. Note that the cursor is on
	the same location as it was before you deleted these lines. The same
	behavior will happen if you delete any of the characters before the
	"2" in the test2 line.
	
	Microsoft has confirmed this to be a problem in the Programmer's
	WorkBench (PWB) version 1.00. We are researching this problem and will
	post new information here as it becomes available.
