---
layout: page
title: "Q60500: How to Abort Compilation When Using PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q60500/
---

## Q60500: How to Abort Compilation When Using PWB

	Article: Q60500
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_c
	Last Modified: 17-JUL-1990
	
	Question:
	
	How do I abort a compile that is in progress when using the
	Programmer's WorkBench (PWB) environment?
	
	Response:
	
	Under MS-DOS (or the OS/2 3.x compatibility box), use CTRL+C to abort.
	
	Under OS/2, use "Arg Meta Compile" to abort a compilation taking place
	in the background.
	
	The default keystrokes for Arg Meta Compile are ALT+A F9 CTRL+F3.
	
	You can also create a macro and assign it to a key to abort the
	compile process. Below is a sample macro that you could place in your
	TOOLS.INI file under the [pwb] tag.
	
	   [pwb]
	   Abort:=Arg Meta Compile
	   Abort:Ctrl+F5
	
	Note: In either OS/2 or MS-DOS, the ESC key and CTRL+BREAK do not
	abort a compilation.
