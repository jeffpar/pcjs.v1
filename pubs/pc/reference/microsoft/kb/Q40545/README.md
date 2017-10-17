---
layout: page
title: "Q40545: ALT+PLUS/EQUALS Doesn't Size QB.EXE 4.50 Window; Must SHIFT"
permalink: /pubs/pc/reference/microsoft/kb/Q40545/
---

## Q40545: ALT+PLUS/EQUALS Doesn't Size QB.EXE 4.50 Window; Must SHIFT

	Article: Q40545
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890111-168
	Last Modified: 12-DEC-1989
	
	To make the current window larger using the keyboard when inside the
	Microsoft QuickBASIC 4.50 environment, you must press either ALT+PLUS
	(pressing the PLUS key on the numeric keypad while holding down ALT)
	or SHIFT+ALT+EQUAL, where EQUAL is the EQUAL/PLUS key on the normal
	keyboard. If you press ALT in conjunction with the EQUAL/PLUS key
	without holding down the SHIFT key, the computer will simply beep
	because this is the same as ALT+EQUAL. This limitation applies only to
	Microsoft QuickBASIC 4.50 for MS-DOS.
	
	QB.EXE Versions 4.00 and 4.00b did not require holding down the SHIFT
	key in conjunction with the EQUAL/PLUS key on the regular keyboard.
	
	In the QBX.EXE environment provided with the Microsoft BASIC PDS
	Version 7.00, the PLUS key must be the key on the numeric keypad.
	Using ALT+PLUS or ALT+SHIFT+PLUS where PLUS is the EQUAL/PLUS has no
	effect.
	
	Inside the QuickBASIC editing environment, pressing the PLUS and MINUS
	keys in conjunction with the ALT key will enlarge or reduce the size
	of the active window. In QB.EXE Versions 4.00 and 4.00b, you can size
	the active window by pressing ALT+PLUS or ALT+MINUS using either the
	PLUS and MINUS keys on the numeric keypad or the regular keyboard.
	
	However, with QuickBASIC Version 4.50, the ALT+PLUS using the
	EQUAL/PLUS key on the regular keyboard will not work unless you use
	SHIFT+ALT+PLUS because you have to press SHIFT to get the PLUS sign on
	the regular keyboard.
	
	In the QBX.EXE environment of the BASIC PDS Version 7.00 the
	ALT+MINUS will work with either the MINUS on the regular keyboard or
	the numeric keypad. ALT+PLUS will work only when PLUS is the PLUS key
	on the numeric keypad.
