---
layout: page
title: "Q41582: Amdek Has CLREPC.EXE to Help with Keyboard Incompatibilities"
permalink: /pubs/pc/reference/microsoft/kb/Q41582/
---

## Q41582: Amdek Has CLREPC.EXE to Help with Keyboard Incompatibilities

	Article: Q41582
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890217-27 B_BasicCom
	Last Modified: 12-NOV-1990
	
	Amdek has a keyboard driver called CLREPC.EXE to help with keyboard
	incompatibilities with QuickBASIC. To obtain this file, you can call
	Amdek Product Support at (408) 435-2832. This program is not
	guaranteed by Microsoft to work properly and is only mentioned for
	your information.
	
	This information applies to QB.EXE from Microsoft QuickBASIC versions
	2.00, 2.01, 3.00, 4.00, 4.00b, 4.50, to QB.EXE from Microsoft BASIC
	Compiler versions 6.00 and 6.00b, and to QBX.EXE from Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS.
	
	It is best to create a batch file that loads the CLREPC.EXE driver and
	then invokes QuickBASIC. The following is a sample batch file:
	
	   clrepc
	   C:\<PATH NAME>\QB
	   set epc
	
	This loads the driver, runs QuickBASIC, and then resets the keyboard
	after you exit QuickBASIC.
	
	This keyboard correction does not let you highlight text with the
	extended-keyboard cursor keys; instead, you must use the numeric
	keypad with the SHIFT key.
