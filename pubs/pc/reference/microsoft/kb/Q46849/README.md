---
layout: page
title: "Q46849: During INPUT, CTRL+T Displays Softkeys on Line 25"
permalink: /pubs/pc/reference/microsoft/kb/Q46849/
---

## Q46849: During INPUT, CTRL+T Displays Softkeys on Line 25

	Article: Q46849
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890627-171 B_BasicCom
	Last Modified: 27-DEC-1989
	
	During an INPUT statement, pressing CTRL+T causes a number line to
	display on line 25 of the screen. These numbers correspond to the
	softkeys that you can define and label with the KEY statement in
	BASIC. This behavior is not documented and occurs in all screen modes.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00.
	
	To prevent this behavior, you can trap for CTRL+T using the KEY
	statement. The key combination is trapped during the INPUT statement
	but is not acted upon until after the INPUT statement is terminated.
	This delay allows you to trap for the key and simply RETURN from the
	label.
	
	The following sample code prevents display of the softkey line during
	the INPUT of the string:
	
	KEY 15, CHR$(&H04) + CHR$(&H14)     'delete these lines
	KEY(15) ON                          'to see the softkey
	ON KEY(15) GOSUB KeyPressed         'display during input
	
	   PRINT "hit CTRL+T then,"
	   PRINT "enter a string"
	   INPUT AnyString$
	
	END
	
	KeyPressed:
	     RETURN
