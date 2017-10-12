---
layout: page
title: "Q58720: Quote Function (CTRL+P) Can Fail to Work Properly"
permalink: /pubs/pc/reference/microsoft/kb/Q58720/
---

	Article: Q58720
	Product: Microsoft C
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist1.00 buglist1.02
	Last Modified: 26-FEB-1990
	
	The Quote function (CTRL+P) in conjunction with CTRL+I or CTRL+T fails
	to display the valid character associated with that key sequence. For
	CTRL+P with CTRL+I, a space character (Hex 20) results instead of the
	correct foreground color rectangle with a background color dot (hex
	09). For CTRL+P with CTRL+T, a lowercase "a" with an accent mark (hex
	A0) results instead of the paragraph sign (hex 14).
	
	The Quote function reads one keystroke from the keyboard and treats it
	literally. This is useful for inserting text into a file that happens
	to be assigned to an editor function. For example, the key sequence
	Quote (CTRL+P) CTRL+A displays a happy face character.
	
	For the Quote CTRL+I sequence, the only workaround is to use a Quote
	TAB key sequence. This puts the correct hex value in that position
	(09H), but the correct character is not displayed and the tab is
	treated as a tab by the M Editor.
	
	For the Quote CTRL+T sequence, there is no workaround.
	
	Microsoft has confirmed this to be a problem with the M Editor Versions
	1.00 and 1.02. We are researching this problem and will post new
	information here as it becomes available.
