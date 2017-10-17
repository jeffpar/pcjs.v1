---
layout: page
title: "Q66744: How to POKE Keystrokes Such as F3 (Last Command) into Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q66744/
---

## Q66744: How to POKE Keystrokes Such as F3 (Last Command) into Keyboard

	Article: Q66744
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 8-NOV-1990
	
	Instead of using CALL INTERRUPT to push keystrokes into the keyboard
	buffer, the code example below POKEs a key directly into the keyboard
	buffer area in memory under MS-DOS.
	
	This information applies to QuickBASIC versions 3.00, 4.00, 4.00b, and
	4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS; and to Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS.
	
	In many applications, it is often useful to echo the command line to
	the screen during repetitive execution of a program. This makes the
	program easier to use by allowing you to avoid typing in the command
	line at the completion of each instance of the program. The code
	example below shows a quick way to push the F3 keystroke into the
	keyboard buffer, which echoes the previously entered command line to
	the screen.
	
	Code Example
	------------
	
	DEF SEG = 0      ' Set default segment to 0
	POKE 1054,0      ' Push 0 for extended key into keyboard buffer
	POKE 1055, 61    ' Push F3 key scan code into keyboard buffer
	POKE 1050, 30    ' Set beginning (head) buffer position
	POKE 0152, 32    ' Set ending (tail) buffer position
	DEF SEG          ' Return current segment pointer to default segment
	
	References
	----------
	
	For more articles about reading from and writing to the keyboard
	buffer, search in this Knowledge Base for the following words:
	
	   interrupt and keyboard and buffer
	
	The addresses for the keyboard buffer area, head, and tail (used in
	the above code example) are documented in "The New Peter Norton
	Programmer's Guide to the IBM PC & PS/2" by Peter Norton and Richard
	Wilton, published by Microsoft Press (1988).
	
	Keyboard scan codes are documented in Appendix D of "Microsoft
	QuickBASIC 4.5: Programming in BASIC"; in Appendix A of "Microsoft
	QuickBASIC 4.0: Language Reference" for 4.00 and 4.00b; in Appendix A
	of "Microsoft BASIC Compiler 6.0: Language Reference" for 6.00 and
	6.00b; and in Appendix A of "Microsoft BASIC 7.0: Language Reference"
	manual for BASIC PDS versions 7.00 and 7.10.
