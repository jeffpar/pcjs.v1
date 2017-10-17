---
layout: page
title: "Q21902: SHELL Can Give &quot;Out of Memory&quot; Error or Fragment Memory"
permalink: /pubs/pc/reference/microsoft/kb/Q21902/
---

## Q21902: SHELL Can Give &quot;Out of Memory&quot; Error or Fragment Memory

	Article: Q21902
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	Question:
	
	Why do I get an "Out of Memory" error when I use the SHELL statement
	or the Shell command?
	
	Response:
	
	The SHELL statement does not clean up or compress memory. If not
	enough contiguous memory is available (for example, if many CHAIN
	statements have been executed, or several dynamic arrays were
	allocated then erased), a SHELL statement may fail with an "Out of
	memory" error. This includes both the Shell command from the File menu
	and also the SHELL statement in a running program.
	
	Also, if you mistakenly install any TSR (terminate and stay resident)
	program during a SHELL command, you will fragment memory, which often
	results in an "Out of Memory" error. For example, if you run the
	QuickBASIC environment, choose the Shell command from the File menu,
	install a TSR, EXIT the Shell, Exit the QuickBASIC environment, and
	reinvoke the QuickBASIC environment from DOS, then you get an "Out of
	Memory" error immediately before you can do anything in the
	environment. You must reboot to unfragment DOS memory.
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS.
	
	TSR programs should NEVER be installed during a SHELL statement or a
	Shell from the File menu. Examples of TSR programs are MSHERC.COM
	(from QuickBASIC 4.50) and QBHERC.COM (from QuickBASIC 4.00/4.00b and
	the BASIC compiler 6.00/6.00b).
