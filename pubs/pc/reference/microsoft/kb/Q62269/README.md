---
layout: page
title: "Q62269: Two Fixed-Length Strings 32K Long in COMMON Hang QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q62269/
---

## Q62269: Two Fixed-Length Strings 32K Long in COMMON Hang QuickBASIC

	Article: Q62269
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 18-OCT-1990
	
	The following two-line program hangs QB.EXE and QBX.EXE:
	
	   COMMON A AS STRING * 32760
	   COMMON B AS STRING * 32760
	
	When run, the line and column counters at the bottom-right corner of
	the screen will be set to 1, the message "Binding" will be displayed
	at the bottom-left corner, and the machine will be hung, requiring a
	soft reboot. If running in the DOS compatibility box of OS/2, only the
	DOS box will be hung.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50; in the QB.EXE
	environment of Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS (buglist6.00, buglist6.00b); and in the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 for MS-DOS (buglist7.00, buglist7.10). We are researching
	this problem and will post new information here as it becomes
	available.
	
	The problem does not occur in programs compiled with BC.EXE.
