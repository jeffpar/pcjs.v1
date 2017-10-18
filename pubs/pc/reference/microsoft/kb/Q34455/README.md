---
layout: page
title: "Q34455: MASM 5.10 MACRO.DOC: BIOS Macro Syntax, Description"
permalink: /pubs/pc/reference/microsoft/kb/Q34455/
---

## Q34455: MASM 5.10 MACRO.DOC: BIOS Macro Syntax, Description

	Article: Q34455
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The following information was taken from the MASM 5.10 MACRO.DOC file.
	
	BIOS Macro Syntax and Description
	
	MODE, PAGE, AND COLOR CONTROL
	
	@GetMode (I 10h F 0Fh)
	
	Gets the current video mode and page
	
	Syntax:         @GetMode
	
	Arguments:      None
	Return:         AL          = Mode
	                AH          = Width in characters
	                BH          = Page
	Registers used: AX and BH
	
	@SetMode (I 10h F 00h)
	
	Gets the current video mode and page
	
	Syntax:         @SetMode mode
	
	Arguments:      mode        = 8-bit video mode
	Return:         none
	Registers used: AX
	
	@SetColor (I 10h F 0Bh)
	
	Sets the background color
	
	Syntax:         @SetColor color
	
	Arguments:      color       = 8-bit background color (0-15);
	                              border color in text modes
	Return:         none
	Registers used: AX and BX
	
	@SetPalet (I 10h F 0Bh)
	
	Sets the color palette
	
	Syntax:         @SetPalet color
	
	Arguments:      color       = 8-bit color palette (0-1 for modes
	5 and 6)
	Return:         none
	Registers used: AX and BX
	
	@SetPage (I 10h F 05h)
	
	Sets the video page
	
	Syntax:         @SetPage page
	
	Arguments:      page        = 8-bit page number; 0-3 for modes 2
	                              and 3
	Return:         none
	Registers used: AX
