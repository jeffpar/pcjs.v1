---
layout: page
title: "Q37409: Using .. in QB.EXE Open File Dialog Doesn't Change Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q37409/
---

## Q37409: Using .. in QB.EXE Open File Dialog Doesn't Change Directory

	Article: Q37409
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 15-DEC-1989
	
	Select Open Program on the QuickBASIC Version 4.00 or 4.00b File Menu
	and use .. (two periods) to go up a directory level. If your menu now
	contains only the .. entry by itself, it will be highlighted, but you
	will not be able to select it. Pressing either the direction or enter
	keys will not allow you to change the directory.
	
	Microsoft has confirmed this to be a problem in Versions 4.00 and
	4.00b. This problem also occurs in the QuickBASIC version included
	with Microsoft BASIC Compiler Versions 6.00 and 6.00b (buglist6.00
	buglist6.00b). This problem was corrected in QuickBASIC Version 4.50
	and in QBX.EXE of Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	The following are results of testing with previous version(s):
	
	   In the QuickBASIC Version 3.00 editor, whenever an option from the
	   File+Load menu is highlighted, it can be selected by pressing the
	   ENTER key.
	
	You can work around this problem by doing the following:
	
	1. Use the TAB key to move to the File Name box.
	
	2. Press ENTER.
	
	3. Tab to the Options box.
	
	4. Press a direction key to highlight the .. option, then press the
	   ENTER key.
