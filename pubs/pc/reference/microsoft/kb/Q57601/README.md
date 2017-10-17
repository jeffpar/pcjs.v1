---
layout: page
title: "Q57601: Using TAB to Move Whole Blocks of Text in QB.EXE or QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q57601/
---

## Q57601: Using TAB to Move Whole Blocks of Text in QB.EXE or QBX.EXE

	Article: Q57601
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900102-126 B_BasicCom
	Last Modified: 12-JAN-1990
	
	In the QuickBASIC environment, you can move a whole block of text
	horizontally by highlighting the block and then pressing the TAB key
	to move it. You can move it any number of spaces by changing the
	length of the tab stop in the Options menu and then highlighting the
	text and pressing TAB to move it to the new tab stop.
	
	If you wish to move the block to the left, press SHIFT+TAB while the
	block is highlighted.
	
	One limitation is that you can move only whole lines at a time. You
	cannot select a column range.
	
	This information applies to QB.EXE in Microsoft QuickBASIC Versions
	4.00, 4.00b, and 4.50 for MS-DOS, to QB.EXE in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS, and to QBX.EXE
	(QuickBASIC Extended) in Microsoft BASIC Professional Development
	System (PDS) 7.00 for MS-DOS.
	
	In QB.EXE Versions 4.00, 4.00b, and 4.50, do not try to move the
	selected block of text using the SPACEBAR because this will delete the
	text. There is no way to restore this text, since these versions can
	undo only the last edit. The last edit, in this case, is the space
	entered by pressing the SPACEBAR, not the deletion of the text.
	Pressing ALT+BACKSPACE (or selecting Undo from the Edit menu) simply
	removes the space and does not bring back the deleted text.
	
	QBX.EXE in Microsoft BASIC PDS Version 7.00 allows you to undo the
	last 20 edits performed, so in the same situation as above, the text
	is recoverable by pressing ALT+BACKSPACE several times consecutively.
