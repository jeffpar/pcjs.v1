---
layout: page
title: "Q61660: Certain Key Sequences Cause R6003 or SYS1943 in PWB 1.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61660/
---

	Article: Q61660
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00 fixlist1.10
	Last Modified: 4-FEB-1991
	
	In the Programmer's Workbench (PWB) version 1.00, it has been observed
	that certain unusual editing sequences can cause the following errors:
	
	In DOS:
	
	   Run-time error R6003 - integer divide by 0
	
	In OS/2:
	
	   SYS1943 protection violation, trap number 13
	
	The following sequences reproduce the errors:
	
	   Procedure                             Keystrokes
	   ---------                             ----------
	
	1. Bring up several files.               ALT+F O x3
	   Select the Options menu.              ALT+O
	   Select Linker options.                L
	   Select Set Debug Options.             ALT+G
	   Pull up help on the options.          F1
	   Arg-refresh through several files.    ALT+A SHIFT+F7 x3
	   Escape back to the Editor screen.     ESC x3
	
	2. Select the Options menu.              ALT+O
	   Select Editor Settings.               S (or K)
	   Go down thirteen lines.               DOWN ARROW key x13
	   Backspace.                            BACKSPACE
	   Undo.                                 ALT+BACKSPACE
	
	Note: Step 2 reproduces only the R6003 error in DOS, not the SYS1943
	error.
