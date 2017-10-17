---
layout: page
title: "Q26605: BC.EXE &quot;Line Too Long&quot; for Source Lines of 256+ Characters"
permalink: /pubs/pc/reference/microsoft/kb/Q26605/
---

## Q26605: BC.EXE &quot;Line Too Long&quot; for Source Lines of 256+ Characters

	Article: Q26605
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 20-JUL-1990
	
	The program below, which has a 263-character-long CONST statement in
	one line, runs without error when loaded in QB.EXE or QBX.EXE, but
	gives a "Line too long" error when compiled with BC.EXE.
	
	A blank line filled with 256 or more space characters (ASCII byte
	value 32) also gives a "Line too long" error at compile time with
	BC.EXE. This is difficult to see, unless you put the cursor on the
	blank line and press the END key to move the cursor to the actual end
	of the line. The column status indicator in the lower-right corner of
	the QB.EXE or QBX.EXE environment then shows the number of characters
	in that line.
	
	The "Line too long" error occurs by design in both cases above because
	the BC.EXE compiler restricts line length to 255 characters, which
	includes the CR (carriage return), LF (linefeed), and the underscore
	(_) line-continuation character.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS and to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS-DOS and MS OS/2.
	
	The QB.EXE and QBX.EXE editors initially prevent you from typing a
	line past column 255, but if you move the cursor to a different line,
	then back, the editors let you add characters past column 255. Despite
	this capability, you should not type lines that exceed 255 characters.
	You can easily check the number of characters in any line by placing
	the cursor on the line in question, pressing the END key, and looking
	at the column counter on the lower-right corner of the screen in the
	QB.EXE or QBX.EXE environment.
	
	Code Example
	------------
	
	BC.EXE compiles this program correctly if you remove one character to
	make the CONST line 262 characters long. Normally, the line limit is
	255 characters, but CONST statements are parsed differently than other
	lines of code, giving you 7 additional characters of leeway in this
	case.
	
	' The following CONST line (where you should type all 263 characters
	' on one line to demonstrate the "Line too long" error in BC.EXE)
	' can be typed past column 255 in QB.EXE or QBX.EXE if you press the
	' DOWN ARROW then the UP ARROW back onto the long line, and
	' continue typing:
	CONST A$ = "12345678901234567890123456789012345678901234567890
	12345678901234567890123456789012345678901234567890
	12345678901234567890123456789012345678901234567890
	12345678901234567890123456789012345678901234567890
	12345678901234567890123456789012345678901234567890"
	
	PRINT A$
