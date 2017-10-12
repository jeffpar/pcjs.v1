---
layout: page
title: "Q47737: Filelength() Includes EOF Character in Return Value"
permalink: /pubs/pc/reference/microsoft/kb/Q47737/
---

	Article: Q47737
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC 2.00
	Last Modified: 14-AUG-1989
	
	The return value of the filelength function is the full length of the
	file in bytes, including any EOF characters. The return value returns
	the same file size value as the DIR command from the DOS or OS/2
	prompt.
