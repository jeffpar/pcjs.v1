---
layout: page
title: "Q30033: Microsoft Editor Macro Moves Text with TAB Key"
permalink: /pubs/pc/reference/microsoft/kb/Q30033/
---

	Article: Q30033
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 6-JAN-1989
	
	The TAB key only moves the cursor. It does not move both the cursor
	and the text under the cursor (as it does in QuickC, Word, and many
	other editors).
	
	To move text and the cursor, put the following macro in your TOOLS.INI
	file in the [M] and/or [MEP] section(s):
	
	   ;Macro to tab with insertion, as in QuickC and Word
	       emacstab:=arg tab sinsert tab
	       emacstab:ctrl+tab
	
	The "emacstab" macro (there is no significance to the name other than
	its similarity to M.EXE's EMACSNEWL and EMACSDEL functions) is invoked
	by pressing CTRL+TAB.
	
	Note: assigning this macro to CTRL+TAB will only function on
	enhanced-style keyboards. Older-style keyboards must use another set
	of keys for this macro assignment. On the older keyboards, assigning
	this macro to CTRL+TAB causes the macro to be ignored.
	
	The emacstab macro functions as follows:
	
	1. The Arg command introduces the argument (in this case, a
	   "stream" arg).
	
	2. The Tab command moves you one tab stop to the right.
	
	3. The Sinsert command moves the highlighted text over to the tab
	   stop.
	
	This macro leaves your cursor back where it started, so one more TAB
	moves your cursor to the right (on top of the shifted text).
