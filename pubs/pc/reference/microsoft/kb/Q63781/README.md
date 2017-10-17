---
layout: page
title: "Q63781: INKEY&#36; Fails with Various CTRL, ALT Key Combinations QB 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q63781/
---

## Q63781: INKEY&#36; Fails with Various CTRL, ALT Key Combinations QB 4.00

	Article: Q63781
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom SR# S900706-
	Last Modified: 13-JUL-1990
	
	The INKEY$ statement fails to return any value with certain CTRL and
	ALT key combinations that should return extended (2-byte) codes. The
	table below lists the keys that fail to return values:
	
	   CTRL+                         ALT+
	   -----                         ----
	
	   TAB                           ` (back apostrophe)
	   INS (INSert)                  BACKSPACE
	   DEL (DELete)                  TAB
	   Keypad 5                      [ and ]
	   Keypad /                      ; and "
	   Keypad *                      , and . and /
	   Keypad -                      ENTER
	   Keypad +                      Keypad / * - and +
	
	Microsoft has confirmed this problem with Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50, and Microsoft BASIC Compiler versions
	6.00 and 6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). The
	problem does not occur with earlier versions of Microsoft BASICs. This
	problem was corrected in Microsoft BASIC Professional Development
	System (PDS) version 7.00 (fixlist7.00).
	
	Function keys, editing keys, and most CTRL and ALT key combinations
	should be returned from INKEY$ as a two-character code where the first
	character is a null character (CHR$(0)) and the second character
	identifies the key pressed.
	
	Code Example
	------------
	
	The following code example demonstrates how to examine key codes for
	any type of key:
	
	   WHILE i$ <> CHR$(27)   'Exit with ESC (ESCape) key
	      i$ = INKEY$
	      SELECT CASE LEN(i$)  'Type of key depends on length
	         CASE 1:
	             PRINT "Single character:", ASC(i$), i$
	         CASE 2:
	             PRINT "Double character:", ASC(RIGHT$(i$,1))
	         CASE ELSE
	             REM no key pressed
	      END SELECT
	   WEND
	   END
