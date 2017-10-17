---
layout: page
title: "Q42796: Background Colors Limited to 0 Through 7 in Text Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q42796/
---

## Q42796: Background Colors Limited to 0 Through 7 in Text Mode

	Article: Q42796
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1990
	
	The function _setbkcolor() displays only colors "0" through "7" when
	in text mode. This is a limit of the hardware, not the library
	function.
	
	Two bytes are allocated for each character displayed on a text 80 x 25
	screen. The first byte is the ASCII code of the character; the second
	is the attribute byte.
	
	The attribute byte contains the information about the foreground and
	background attributes of the character. Four bits of this byte are
	allocated for the foreground color. The most significant bit of the
	foreground color is set aside for intensity or highlight. However, of
	the 4 bits allocated for the background color, the most significant
	bit is reserved to indicate a blinking or a nonblinking state.
	
	The layout of the attribute bytes is as follows:
	
	            7    6   5   4   3   2   1   0
	         +----+------------+---+------------+
	         | BL | background | I | foreground |
	         +----+------------+---+------------+
	
	Since only 3 bits are used to indicate the background color, only
	numbers from 0 through 7 can be represented. For this reason, only
	colors 0 through 7 are available as background colors for
	_setbkcolor().
	
	On most display adapters, you can set the adapter such that the blink
	bit becomes a background intensity bit. See your hardware technical
	reference or the "Programmer's Guide to PC and PS/2 Video Systems"
	(Richard Wilton, Microsoft Press) for more information.
