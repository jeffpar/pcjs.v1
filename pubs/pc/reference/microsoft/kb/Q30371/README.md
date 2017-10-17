---
layout: page
title: "Q30371: printf() Does Not Display Text in the Current Text Color"
permalink: /pubs/pc/reference/microsoft/kb/Q30371/
---

## Q30371: printf() Does Not Display Text in the Current Text Color

	Article: Q30371
	Version(s): 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 14-DEC-1990
	
	It is not possible to display colored text with printf() by setting
	the text color with _settextcolor() because text output with printf()
	is not affected by the current text color.
	
	To display colored text, you can use the _outtext() routine but
	_outtext() does not provide text formatting capabilities like printf().
	If you need the printf() type of text formatting as well as color,
	then you should use a function such as sprintf() to print the
	formatted text to a buffer and then you can use _outtext() to print
	the buffer in the desired color.
