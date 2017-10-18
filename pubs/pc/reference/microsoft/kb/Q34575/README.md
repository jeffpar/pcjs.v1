---
layout: page
title: "Q34575: MASM 5.10 MACRO.DOC: Character and Cursor Control"
permalink: /pubs/pc/reference/microsoft/kb/Q34575/
---

## Q34575: MASM 5.10 MACRO.DOC: Character and Cursor Control

	Article: Q34575
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM Version 5.10
	MACRO.DOC file.
	
	CHARACTER AND CURSOR CONTROL
	
	@GetCur (I 10h F 04h)
	
	Gets the cursor position and size
	
	Syntax:         @GetCur [page]
	
	Arguments:      page        = 8-bit page with cursor (if none, 0
	assumed)
	Return:         DL          = Column
	                DH          = Row
	                CL          = Starting scan line
	                CH          = Ending scan line
	Registers used: AX, DX, CX, and BH
	
	@SetCurPos (I 10h F 02h)
	
	Sets the cursor position
	
	Syntax:         @SetCurSz [column] [,[row] [,page]]
	
	Arguments:      column      = 8-bit column; if none, DL used
	                row         = 8-bit row; if none, DH used
	                page        = 8-bit page with cursor (if none, 0
	                              assumed)
	Return:         none
	Registers used: AX, DX, and BH
	
	@SetCurSz (I 10h F 01h)
	
	Sets the cursor size and shape by specifying active scan lines. The
	CGA adapter the lines are 0-7. The monochrome adapter has lines
	0-13.
	
	Syntax:         @SetCurSz startline, endline
	
	Arguments:      startline   = 8-bit starting scan line (default C
	GA=6; MA=12)
	                endline     = 8-bit ending scan line (default CGA=7;
	MA=13)
	Return:         none
	Registers used: AX and CX
	
	@GetChAtr (I 10h F 08h)
	
	Gets the character and attribute at the cursor location
	
	Syntax:         @GetChAtr [page]
	
	Arguments:      page        = 8-bit page to check (if none, 0
	assumed)
	Return:         AH          = Attribute
	                AL          = ASCII character
	Registers used: AX and BH
	
	@PutChAtr (I 10h F 09h) and @PutCh (I 10h F 0Ah)
	
	Puts one or more characters and attributes at the current cursor
	position. For @PutCh, the current attribute is used in text modes and
	any specified attribute is ignored.
	
	Syntax:         @PutChAtr [character] [,[attrib] [,[page]
	[,count]]]
	
	Arguments:      character   = 8-bit ASCII character to put; if
	                              none, AL used
	
	                attrib      = 8-bit attribute to put; if none, BL
	                              used
	                page        = 8-bit page to put on (if none, 0
	                              assumed)
	                count       = Number to put (if none, 1 assumed)
	Return:         AH          = Attribute
	                AL          = ASCII character
	Registers used: AX, BX, CX
	
	@Scroll (I 10h F 06h and 07h)
	
	Scrolls a specified window up or down
	
	Syntax:         @Scroll dist [,[attr] [,[uprow [,[upcol [,[dnrow]
	                [,dncol]]]]]
	Arguments:      dist        = 8-bit number of lines to scroll;
	                              positive scrolls down; negative scrolls
	                              up; 0 clears
	                attr        = 8-bit attribute for blank lines (if
	                              none, 07h)
	                uprow       = Upper left row (if none, CH used)
	                upcol       = Upper left column (if none, CL used)
	                dnrow       = Lower right row (if none, DH used)
	                dncol       = Lower right column (if none, DL used)
	Return:         none
	Registers used: AX, CX, DX, and BH
	
	@Cls (I 10h F 06, 08h, and 02h)
	
	Clears the screen of the current page
	
	Syntax:         @Cls
	
	Arguments:      None
	Return:         None
	Registers used: AX, BX, CX, and DX
