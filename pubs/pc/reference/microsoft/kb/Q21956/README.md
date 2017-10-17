---
layout: page
title: "Q21956: Using Page 2 in SCREEN 9 Gives &quot;Illegal Function Call&quot; on EGA"
permalink: /pubs/pc/reference/microsoft/kb/Q21956/
---

## Q21956: Using Page 2 in SCREEN 9 Gives &quot;Illegal Function Call&quot; on EGA

	Article: Q21956
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 11-JAN-1990
	
	Question:
	
	Why do I get an "Illegal Function Call" error message when I reference
	Page 2 in SCREEN mode 9 on a computer with an EGA card? The following
	is an example:
	
	   SCREEN 9,1,2,2  'EGA mode=9, 1=colorswitch on, apage=2, vpage=2
	   COLOR 2,0
	   LINE (1,1)-(100,100)
	
	Response:
	
	Screen 9 does have two pages available, but the pages are referenced
	as "0" and "1". Note that "2" is not a valid page number in screen 9.
	The program will work correctly if coded as follows:
	
	   SCREEN 9,1,1,1  'EGA mode=9, 1=colorswitch on, apage=1, vpage=1
	   COLOR 2,0
	   LINE (1,1)-(100,100)
