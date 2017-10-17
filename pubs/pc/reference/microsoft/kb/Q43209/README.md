---
layout: page
title: "Q43209: NUM LOCK On Affects QB.EXE Cut, Copy, Paste on Numeric Keypad"
permalink: /pubs/pc/reference/microsoft/kb/Q43209/
---

## Q43209: NUM LOCK On Affects QB.EXE Cut, Copy, Paste on Numeric Keypad

	Article: Q43209
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890404-247 B_BasicCom
	Last Modified: 15-DEC-1989
	
	If NUM LOCK is on in the QB.EXE editor, pressing SHIFT+DEL, CTRL+INS,
	or SHIFT+INS does not Cut, Copy, or Paste when pressed on the numeric
	keypad. NUM LOCK must be off for these "quick keys" to work on the
	numeric keypad; when you turn on NUM LOCK, the numbers become active
	on the keypad instead of INS and DEL.
	
	The NUM LOCK status does not affect the dedicated, INS and DEL keys on
	the IBM extended keyboard (which are usually colored gray to show
	their unique function). Use these dedicated keys if you have an
	extended keyboard and wish to be independent of the NUM LOCK status.
	
	This information applies to the QB.EXE environment of QuickBASIC
	Versions 4.00, 4.00b, and 4.50 and to Microsoft BASIC Compiler
	Versions 6.00 and 6.00b. The information also applies to the QBX.EXE
	environment of Microsoft BASIC PDS Version 7.00.
	
	The following are the quick-key functions:
	
	   Quick Key           Function
	   ---------           --------
	
	   SHIFT+DEL           Cut
	   CTRL+INS            Copy
	   SHIFT+INS           Paste
