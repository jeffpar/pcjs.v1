---
layout: page
title: "Q38855: Use of CRLF.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q38855/
---

	Article: Q38855
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	The QuickC editor has the following restrictions on the files it
	can edit:
	
	1. All lines must be terminated by a carriage return (CR) followed
	   by a line feed (LF)--ASCII codes 0x0D/0x0A.
	
	2. Character 0 is not allowed. All other characters in the
	   range 1 to 255 are allowed.
	
	The editor specifically handles CR (0x0D), LF (0x0A), and HT (0x09).
	Because other control characters may be undesirable, CRLF allows you to
	optionally change control characters to a specified character
	or to simply remove them. The syntax is as follows,
	
	   crlf <infile> <outfile> [/c<ascii>]
	
	where <infile> is the file to be translated, <outfile> is the new
	translated file, and <ascii> is the ASCII code for the character
	to which control characters (except CR, LF, and HT) will be translated.
	The ASCII code may be entered in decimal (ddd), octal (0ddd), or
	hexadecimal (0xddd).
	
	For example, /c32 will translate all control characters to spaces. If
	<ascii> is given as 0, control characters will be removed rather than
	translated. If /c is not given, the program will prompt for
	translation characters.
