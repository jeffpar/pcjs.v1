---
layout: page
title: "Q45906: No Extended ASCII in SCREEN 4 on Olivetti/AT&amp;T 6300"
permalink: /pubs/pc/reference/microsoft/kb/Q45906/
---

## Q45906: No Extended ASCII in SCREEN 4 on Olivetti/AT&amp;T 6300

	Article: Q45906
	Version(s): 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890606-97
	Last Modified: 22-JUN-1989
	
	It has been reported that when using QuickBASIC Version 4.00b or 4.50,
	characters in the extended ASCII character set (codes 128 to 255) are
	not visible in SCREEN 4 on an AT&T 6300. However, the extended
	characters are visible in SCREEN 0 (text mode).
	
	This may be a hardware limitation. Microsoft is researching this
	problem and will post new information as it becomes available.
	
	Code Example
	------------
	
	The following code example displays blanks in SCREEN 4, but displays
	the correct extended characters in SCREEN 0:
	
	SCREEN 4     'works for SCREEN 0
	FOR i%=128 TO 255
	   PRINT CHR$(i%)
	NEXT i%
