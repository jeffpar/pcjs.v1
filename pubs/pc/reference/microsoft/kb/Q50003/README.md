---
layout: page
title: "Q50003: Bits Per Pixel Per Plane for Graphics GET for SCREEN 3 and 4"
permalink: /pubs/pc/reference/microsoft/kb/Q50003/
---

## Q50003: Bits Per Pixel Per Plane for Graphics GET for SCREEN 3 and 4

	Article: Q50003
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891016-54 B_BasicCom docerr
	Last Modified: 13-DEC-1989
	
	The bits-per-pixel-per-plane values and the number of planes for
	SCREEN 3 and SCREEN 4 were omitted and must be added under the
	graphics GET statement in the following sources:
	
	1. Page 207 of "Microsoft QuickBASIC 4.0: BASIC Language Reference"
	   manual for Versions 4.00 and 4.00b
	
	2. Page 207 of "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" manual for Versions 6.00 and 6.00b for MS-DOS
	
	3. Page 151 of "Microsoft BASIC Version 7.00: BASIC Language
	   Reference" manual for Version 7.00 for MS-DOS
	
	4. The QuickBASIC Advisor on-line help screen for QuickBASIC 4.50
	   under "HELP: GET (Graphics) Statement Details"
	
	5. The QuickBASIC Extended Advisor on-line help screen for BASIC
	   Compiler 7.00 under "HELP: GET (Graphics) Statement Details"
	
	Below is a table that contains the complete values for bits per pixel
	per plane and the number of planes used by the GET (Graphics)
	statement.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and to Microsoft BASIC Compiler Versions 6.00, and 6.00b for
	MS-DOS and to Microsoft BASIC PDS 7.00 for MS-DOS.
	
	The following complete table provides values necessary to calculate
	the array size required by the graphics GET Statement:
	
	                Bits
	                Per Pixel
	   Mode         Per Plane     Planes
	   ----         ---------     ------
	   SCREEN 1     2             1
	   SCREEN 2     1             1
	   SCREEN 3     1             1   <<-- (Add to manual)
	   SCREEN 4     1             1   <<-- (Add to manual)
	   SCREEN 7     1             4
	   SCREEN 8     1             4
	   SCREEN 9     1             2 (if 64K of EGA memory)
	                              4 (if more than 64K of EGA memory)
	   SCREEN 10    1             2
	   SCREEN 11    1             1
	   SCREEN 12    1             4
	   SCREEN 13    8             1
	
	The GET statement transfers a screen image into an array. The PUT
	statement, associated with GET, transfers the image stored in the
	array onto the screen.
	
	For the statement
	
	   GET (x1,y1)-(x2,y2),arrayname
	
	the following formula gives the required size of the array in bytes:
	
	   4+INT(((x2-x1+1)*(bits-per-pixel-per-plane)+7)/8)*planes*((y2-y1)+1)
