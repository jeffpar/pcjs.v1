---
layout: page
title: "Q66740: CTRL+NUM/ May be Read as CTRL+/ in DOS with NUM LOCK On"
permalink: /pubs/pc/reference/microsoft/kb/Q66740/
---

## Q66740: CTRL+NUM/ May be Read as CTRL+/ in DOS with NUM LOCK On

	Article: Q66740
	Version(s): 1.00 1.10 | 1.00 1.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist1.10
	Last Modified: 15-NOV-1990
	
	In versions 1.00 and 1.10 of Programmer's WorkBench (PWB), the
	CTRL+NUM/ (CTRL+/ on the numeric keypad) and ALT+NUM/ (ALT+/ on the
	numeric keypad) combinations may be interpreted as CTRL+/ and ALT+/
	(on the main keyboard). This problem happens only in DOS or the OS/2
	DOS 3.x box, and only on certain computers. This behavior will cause
	any macro or function assigned to CTRL+NUM/ or ALT+NUM/ to not execute
	when NUM LOCK is on.
	
	To reproduce this problem, assign a function or macro to CTRL+NUM/.
	Then execute the TELL function (CTRL+T by default) and press CTRL+NUM/.
	The TELL function prompts for a keystroke, then displays the name of
	the keystroke and the function assigned to it. With NUM LOCK on, TELL
	will return the following:
	
	   unassigned:Ctrl+/.
	
	With NUM LOCK off, TELL will return the following:
	
	   <function name>:Ctrl+num/.
	
	This behavior is identical for the ALT+NUM/ key name, but works
	properly for all other key names on the numeric keypad.
	
	If NUM LOCK is off, or if the protected-mode version of PWB is run,
	this behavior does not occur.
	
	This behavior has been observed on the following machines:
	
	   Northgate 386-33
	   PS/2 Model 70
	   PS/2 Model 80-311
	
	Microsoft has confirmed this to be a problem in PWB version 1.00 and
	1.10. We are researching this problem and will post new information
	here as it becomes available.
