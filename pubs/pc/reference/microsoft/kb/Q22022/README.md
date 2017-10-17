---
layout: page
title: "Q22022: PRINT Forces Contiguous String to Next Row &amp; Doesn't Wrap It"
permalink: /pubs/pc/reference/microsoft/kb/Q22022/
---

## Q22022: PRINT Forces Contiguous String to Next Row &amp; Doesn't Wrap It

	Article: Q22022
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_GWBasicI B_BasicCom
	Last Modified: 19-JAN-1990
	
	The PRINT statement displays a contiguous string constant on the next
	row below the current print position (without breaking or wrapping the
	string) if printing it from the current screen column exceeds the 80th
	column.
	
	This behavior is by design. You will need to break the string into a
	piece small enough to fit within the space before the 80th column to
	avoid forcing the whole string to the next line (see example below).
	
	This standard behavior occurs in most retail Microsoft BASIC versions
	for MS-DOS, including the following products:
	
	1. QuickBASIC Compiler (Versions 2.00, 2.01, 3.00, 4.00, 4.00b,
	   and 4.50) for MS-DOS
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   OS/2
	
	3. Microsoft BASIC Professional Development System (PDS) Version 7.00
	   for MS-DOS and OS/2
	
	4. GW-BASIC Versions 3.20, 3.22, and 3.23
	
	The following is a code example:
	
	   5  CLS
	   10 LOCATE 1,1    ' LOCATEs in column 1.
	   20 PRINT "LOCATED ON ROW 1, THIS STRING STAYS ON ROW 1."
	   30 LOCATE 2,70    ' LOCATEs in column 70, leaving no room.
	   40 PRINT "DESPITE BEING LOCATED ON ROW 2, THIS PRINTS ON ROW 3"
	   50 LOCATE 4,71   ' To make it wrap, break up the string as follows:
	   60 PRINT "1234567890";"THIS STARS IN COLUMN 1"
