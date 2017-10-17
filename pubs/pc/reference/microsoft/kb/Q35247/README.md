---
layout: page
title: "Q35247: QB.EXE &quot;Bad File Mode&quot; if First Character Extended ASCII"
permalink: /pubs/pc/reference/microsoft/kb/Q35247/
---

## Q35247: QB.EXE &quot;Bad File Mode&quot; if First Character Extended ASCII

	Article: Q35247
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 13-DEC-1989
	
	The error "Bad File Mode" will occur while opening or loading a
	document file in the QB.EXE editor if an extended ASCII character is
	the very first character in the file. To avoid this error, put a space
	or a blank line before the extended ASCII character so that it is not
	the first character in the file. This error does not occur in the
	QB.EXE editor which comes with Microsoft QuickBASIC Version 4.50 or in
	the QBX.EXE environment that comes with Microsoft BASIC PDS Version
	7.00.
	
	In the QB.EXE editor in QuickBASIC Versions 2.00, 2.01, and 3.00,
	extended ASCII characters are not allowed within the first 80 bytes of
	the loaded file. (The same is true for QB87.EXE in Version 3.00.)
	
	Extended ASCII bytes have values from 128 to 255.
