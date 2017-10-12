---
layout: page
title: "Q61238: C 6.00 README: 43-Line Mode with DOS 4.01 ANSI.SYS"
permalink: /pubs/pc/reference/microsoft/kb/Q61238/
---

	Article: Q61238
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 24-JAN-1991
	
	The following information is taken from the C version 6.00 README.DOC
	file.
	
	43-Line Mode with DOS 4.01 ANSI.SYS
	-----------------------------------
	
	You may experience problems trying to switch CodeView or the
	Programmer's WorkBench (PWB) to 43-line mode if you are using DOS 4.01
	and ANSI.SYS.
	
	To use Codeview or PWB in 43-line mode in this situation, switch to
	43-line mode using the MODE command (MODE CO80,43) before you invoke
	the program.
	
	This problem also affects the graphics functions _settextrows and
	_setvideomoderows. Under DOS 4.01 with ANSI.SYS installed, using these
	functions to set 43-line mode may cause unexpected behavior.
	
	At the moment, the only known solution is to remove ANSI.SYS from your
	CONFIG.SYS file and reboot your machine.
