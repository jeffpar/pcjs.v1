---
layout: page
title: "Q63567: Behavior of Tabs in QuickC 2.50"
permalink: /pubs/pc/reference/microsoft/kb/Q63567/
---

	Article: Q63567
	Product: Microsoft C
	Version(s): 2.50
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM
	Last Modified: 9-JUL-1990
	
	The "Keep Tabs" option controls how tabs are displayed on the screen
	and saved to disk.
	
	The effect of "Keep Tabs" in the editor is as follows:
	
	With "Keep Tabs" selected all tabs are represented as actual tabs on
	the display (HEX 09), that is, when you backspace over a tab, the
	cursor leaps to the next tabstop to the left.
	
	When "Keep Tabs" is not selected, a series of spaces (HEX 20) will be
	placed on the display instead of an actual tab character, that is,
	when you backspace over a tab it moves the cursor only one space to
	the left instead of to the next tabstop.
	
	The saved files behave in the following way:
	
	In the saved file with "Keep Tabs" on and with leading whitespace
	before the tabs/spaces, tabs will be saved as tab characters (HEX 09)
	and spaces will be saved as spaces (HEX 20). With no leading
	whitespace, tabs will be saved as tab characters (Hex 09) and spaces
	will be saved as spaces (HEX 20).
	
	In the saved file with "Keep Tabs" off and with leading whitespace,
	the leading whitespace is converted to tabs (and spaces if necessary),
	and all other whitespace is converted to spaces.
