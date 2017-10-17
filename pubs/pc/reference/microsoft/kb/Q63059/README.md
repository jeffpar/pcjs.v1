---
layout: page
title: "Q63059: PWB Text Highlight with Mouse Acts Strange After Search"
permalink: /pubs/pc/reference/microsoft/kb/Q63059/
---

## Q63059: PWB Text Highlight with Mouse Acts Strange After Search

	Article: Q63059
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-AUG-1990
	
	The click-and-drag method of selecting text with the mouse in the
	Programmer's Workbench (PWB) sometimes works incorrectly when used
	after a search function.
	
	To reproduce this problem, do the following:
	
	1. Select a word in the text using the mouse (double-click on a single
	   word).
	
	2. Execute the search function (select the Search menu, choose Find,
	   then OK).
	
	3. Now try to highlight the text a few lines below the word you used
	   to search on (using the click-and-drag method).
	
	The text will be highlighted starting at the original word that was
	searched for, rather than at the starting mouse position.
	
	To work around this problem, click the left button anywhere in the
	text window, then perform the text highlight.
	
	Microsoft has confirmed this to be a problem with the Programmer's
	Workbench version 1.00. We are researching this problem and will post
	new information here as it becomes available.
