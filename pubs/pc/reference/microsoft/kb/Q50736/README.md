---
layout: page
title: "Q50736: How to Enter Extended ASCII Characters in QB.EXE Using ALT Key"
permalink: /pubs/pc/reference/microsoft/kb/Q50736/
---

## Q50736: How to Enter Extended ASCII Characters in QB.EXE Using ALT Key

	Article: Q50736
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890925-102 B_BasicCom
	Last Modified: 13-MAR-1990
	
	To enter most ASCII character byte values in the QB.EXE editor,
	including characters without their own keys, you can hold down the ALT
	key while typing in the numeric value for the character on the numeric
	keypad and then releasing the ALT key. The character with that code
	will be inserted at the current cursor position. For example,
	ALT+1+7+2 is the symbol for one-fourth (1/4).
	
	Extended ASCII characters (values 128 to 255) are useful for typing
	line-drawing characters, foreign alphabet characters, or other special
	symbols into quoted strings or comments (REM or ') in your code. For
	example, QCARDS.BAS for QuickBASIC 4.50 uses extended ASCII characters
	to make attractive screen boxes.
	
	This information applies to QB.EXE in Microsoft QuickBASIC Versions
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to QB.EXE in
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, and to
	QBX.EXE in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	Most of the ASCII characters (32 through 255) can be entered using the
	ALT key, including the normal alphabetic characters. For example, if
	the ALT key is held down while the number 65 is typed on the numeric
	keypad (with NUM LOCK active) and then ALT is released, "A" is
	inserted at the current cursor position, since the ASCII code for "A"
	is 65 (decimal). This ALT key technique also works at the MS-DOS
	command line and in many other programs in MS-DOS.
	
	How to Handle ASCII 0-31 Control Codes
	--------------------------------------
	
	Note that you cannot use the above ALT key method to embed ASCII
	character codes 0 through 31 into your source code. (ASCII characters
	0 through 31, which are often called control characters, have special
	program-specific meanings.) You also cannot type ASCII 240 using the
	ALT key in QB.EXE or QBX.EXE (ALT+2+4+0). If you want to use a
	character with ASCII value 0-31 or 240 as output from your BASIC
	program, you can use the CHR$() function to generate the character.
	The CHR$() function can be used to generate any ASCII (0-127) or
	extended-ASCII (128-255) character for output from a BASIC program.
	
	However, in QuickBASIC 4.00, 4.00b, and 4.50, and in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b, the PRINT statement does not display
	any character for control codes 7, 9-13, and 28-31 at run time
	(whether the character is embedded in a string with CTRL+P or created
	with the CHR$() function). For more information, query on the
	following words:
	
	   ASCII and PRINT and SCRN and CONS
	
	NOTE: In QB.EXE 4.00 and later and in QBX.EXE 7.00, you can use the
	CTRL+P key to enter some of the control codes from 1 through 31. As an
	example, for 1 press CTRL+P+A, for 2 press CTRL+P+B, for 3 press
	CTRL+P+C, ..., and for 31 press CTRL+P+_ (CTRL+P+underscore).
	Many of these control codes can be typed into string constants or
	comments in your source code. WARNING: BC.EXE may not accept some
	control codes embedded in your source file. Also, the QBX.EXE editor
	does not let you enter the following CTRL+P sequences: CTRL+P+@ (0),
	CTRL+P+J (10), CTRL+P+M (13), CTRL+P+\ (28), or CTRL+P+^ (30).
	Microsoft recommends using the CHR$() function to generate the control
	characters you need instead of typing control characters directly into
	the source file.
	
	References for ASCII Symbols 0-255
	----------------------------------
	
	The numeric character codes 0-255 are documented in the following
	ASCII and extended-ASCII tables:
	
	1. In the QuickBASIC 4.50 QB Advisor online Help system under
	   Contents, "ASCII Character Codes"
	
	2. In the Microsoft Advisor online Help system for BASIC PDS 7.00
	   under Contents, "ASCII Character Codes"
	
	3. Pages 464-465 of "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" manual for Versions 4.00 and 4.00b
	
	4. Pages 464-465 of "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" for Versions 6.00 and 6.00b for MS OS/2 and MS-DOS
	
	5. Pages 602-603 of "Microsoft BASIC 7.0: Language Reference"
