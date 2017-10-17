---
layout: page
title: "Q66215: CV1319 Error May Be Caused by Generic Breakpoints"
permalink: /pubs/pc/reference/microsoft/kb/Q66215/
---

## Q66215: CV1319 Error May Be Caused by Generic Breakpoints

	Article: Q66215
	Version(s): 3.00   | 3.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	In some situations a program will hang with the CodeView
	initialization error CV1319 even though the program runs correctly
	outside of CodeView. Deleting any generic breakpoints in the
	CURRENT.STS file may resolve this problem. The following is an
	example:
	
	   [debug-]
	         genericbp='E 0x47:0x0007
	
	The problem is that when you recompile your program, the code moves
	and the absolute breakpoint may now be set in the middle of a
	multibyte instruction rather than the beginning of the instruction.
	
	Additional Workaround
	---------------------
	
	Invoke CodeView with the /TSF ("Toggle StateFileread") option. This
	option will either read or ignore the CURRENT.STS file based on what
	the statefileread switch is set to in the TOOLS.INI file.
	
	For example, if the statefileread switch is set to "yes" (the default)
	and CodeView is invoked with the /TSF option, the CURRENT.STS file
	will be ignored.
