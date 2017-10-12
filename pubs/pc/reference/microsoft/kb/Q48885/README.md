---
layout: page
title: "Q48885: Newline Character (&#92;n) Is Equivalent to ASCII Linefeed (0x0A)"
permalink: /pubs/pc/reference/microsoft/kb/Q48885/
---

	Article: Q48885
	Product: Microsoft C
	Version(s): 5.00 5.10  | 5.00 5.10
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QuickC S_QuickAsm
	Last Modified: 16-JAN-1990
	
	The newline character in Microsoft C (\n) is equivalent to the ASCII
	linefeed character (hex 0A). Thus, for files opened in text mode,
	CR/LF pairs are read in as newline characters, and newline characters
	are written as CR/LF.
	
	This information applies to STDIN, STDOUT, and STDERR, which are
	opened in text mode by default.
	
	When using strtok() to extract tokens separated by CR/LF in a file
	opened in text mode, only \n must be used as a token delimiter.
