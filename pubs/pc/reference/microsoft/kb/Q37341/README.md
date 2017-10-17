---
layout: page
title: "Q37341: How to Create Your Own Font in Character Mode for EGA Text"
permalink: /pubs/pc/reference/microsoft/kb/Q37341/
---

## Q37341: How to Create Your Own Font in Character Mode for EGA Text

	Article: Q37341
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	The code example below shows a method of creating a user-defined text
	font for use with an EGA or VGA monitor. This method allows a person
	to define a specified number of new characters that are in order
	starting at a specified position in the table. Only those characters
	in the character set that are overwritten by the new fonts are
	changed. In the example below, the three new characters are printed
	and the fourth character from the original set is printed.
	
	This code example applies to QuickBASIC Versions 4.00, 4.00b, and
	4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS,
	and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	Note: Microsoft BASIC PDS Version 7.00 comes with a library of
	routines that allow loading and displaying of bitmapped fonts. BASIC
	PDS 7.00 comes with several font files, and the font library routines
	can load and display any of the Microsoft Windows bitmapped fonts.
	
	The following is a code example:
	
	' $INCLUDE: 'qb.bi'
	DIM RegS AS RegType, RegL AS RegTypeX
	DIM table(100)
	DATA 0,0,0,2,6,14,30,62,126,254,0,0,0,0
	DATA 0,0,0,254,64,32,16,32,64,254,0,0,0,0
	DATA 0,0,0,132,136,158,162,70,130,14,0,0,0,0
	
	CLS
	DEF SEG = VARSEG(table(0))
	FOR i = 1 TO 42
	   READ A%        'Place the NEW characters into
	   POKE VARPTR(table(0)) + i, A%    'graphics table
	NEXT i
	DEF SEG
	
	RegL.AX = &H1100   ' function 11 subfunction 0
	RegL.BX = &HE00    ' There are &HE points per character
	                   ' put font at table 0
	RegL.CX = &H3      ' defined three characters
	RegL.DX = 0        ' first character is chr$ (0)
	RegL.DS = -1       ' use old data seg
	RegL.ES = VARSEG(table(0))  ' address of table
	RegL.BP = VARPTR(table(0))  ' that holds the fonts
	CALL interruptX(&H10, RegL, RegL)  ' make the call
	
	PRINT CHR$(0) + CHR$(1) + CHR$(2) + CHR$(3)
