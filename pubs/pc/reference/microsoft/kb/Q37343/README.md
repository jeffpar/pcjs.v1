---
layout: page
title: "Q37343: How to Define Your Own Font in Graphics Mode for EGA or VGA"
permalink: /pubs/pc/reference/microsoft/kb/Q37343/
---

## Q37343: How to Define Your Own Font in Graphics Mode for EGA or VGA

	Article: Q37343
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 31-OCT-1988
	
	A programmer can create a specialized graphics font for use with the
	EGA or VGA graphics systems. The new font is installed by making a
	BIOS interrupt call. When you install your own font, none of the
	original graphics characters are available until they are reinstated.
	
	The code example below creates and installs a new user font. This font
	consists of the following four characters:
	
	   triangle
	   capital Sigma
	   the fraction 1/3 (one third)
	   a space
	
	The program displays the characters and then reinstates the original
	font and displays the original characters.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, 4.50 and
	to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	OS/2.
	
	The following is a code example:
	
	' $INCLUDE: 'q:qb.bi'
	DIM RegS AS regtype, RegL AS Regtypex
	DIM table(100)
	DATA 0,0,0,2,6,14,30,62,126,254,0,0,0,0
	DATA 0,0,0,254,64,32,16,32,64,254,0,0,0,0
	DATA 0,0,0,132,,136,158,162,70,130,14,0,0,0,0
	DATA 0,0,0,0,0,0,0,0,0,0,0,0,0,0
	CLS
	DEF SEG = VARSEG(table(0))
	FOR i = 1 TO 56
	   READ A%      'Place the created characters into the new
	   POKE VARPTR(table(0)) + i, A%    'graphics table
	NEXT i
	DEF SEG
	
	SCREEN 9
	' set user defined font
	RegL.AX = &H1121
	RegL.BX = &H0
	RegL.CX = &HE
	RegL.DX = 0
	RegL.DS = -1
	RegL.ES = VARSEG(table(0))
	RegL.BP = VARPTR(table(0))
	CALL InterruptX(&H10, RegL, RegL)
	
	LOCATE 10, 10
	FOR i = 0 TO 3
	   PRINT CHR$(i) + CHR$(4); 'prints new user font
	NEXT
	
	'  switch back
	RegL.AX = &H1122
	RegL.BX = 0
	CALL InterruptX(&H10, RegL, RegL)
	
	LOCATE 12, 10
	FOR i = 0 TO 3
	   PRINT CHR$(i); " "; 'prints normal characters
	NEXT
