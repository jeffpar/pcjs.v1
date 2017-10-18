---
layout: page
title: "Q30821: MASM 5.10 OS2.DOC: OS/2 Call Summary - Video Output"
permalink: /pubs/pc/reference/microsoft/kb/Q30821/
---

## Q30821: MASM 5.10 OS2.DOC: OS/2 Call Summary - Video Output

	Article: Q30821
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Video output constant - INCL_VIO
	
	   @VioRegister - Registers a video subsystem within a screen group
	   Parameters - ModuleName:PZ, EntryPoint:PZ, FunctionMask1:D, FunctionMask2:
	
	   @VioDeRegister - Deregisters a previously registered video subsystem
	   Parameters - None
	
	   @VioGetBuf - Returns the address of the logical video buffer
	   Parameters - LVBPtr:PD, Length:PW, VioHandle:W
	
	   @VioGetCurPos - Returns the cursor position
	   Parameters - Row:PW, Column:PW, VioHandle:W
	
	   @VioSetCurPos - Sets the cursor position
	   Parameters - Row:W, Column:W, VioHandle:W
	
	   @VioGetCurType - Returns the cursor type
	   Parameters - CursorData:PS, VioHandle:W
	   Structure - VIOCURSORINFO
	
	   @VioSetCurType - Sets the cursor type
	   Parameters - CursorData:PS, VioHandle:W
	   Structure - VIOCURSORINFO
	
	   @VioGetMode - Returns display mode information
	   Parameters - ModeData:PS, VioHandle:W
	   Structure - VIOMODEINFO
	
	   @VioSetMode - Sets the display mode
	   Parameters - ModeData:PS, VioHandle:W
	   Structure - VIOMODEINFO
	
	   @VioGetPhysBuf - Returns the address of the physical video buffer
	   Parameters - Structure:PS, Reserved:W
	   Structure - VIOPHYSBUF
	
	   @VioReadCellStr - Reads a string of character-attributes (cells)
	                     from screen
	   Parameters - CellStr:PW, Length:PW, Row:W, Column:W, VioHandle:W
	
	   @VioReadCharStr - Reads a string of characters from screen
	   Parameters - CharStr:PB, Length:PW, Row:W, Column:W, VioHandle:W
	
	   @VioWrtCellStr - Writes a string of character-attributes (cells) to
	                    screen
	   Parameters - CellStr:PB, Length:W, Row:W, Column:W, VioHandle:W
	
	   @VioWrtCharStr - Writes a string of characters to screen
	   Parameters - CharStr:PB, Length:W, Row:W, Column:W, VioHandle:W
	
	   @VioScrollDn - Scrolls the current screen down
	   Parameters - TopRow:W, LeftCol:W, BotRow:W, RightCol:W, Lines:W
	                Cell:PW, VioHandle:W
	
	   @VioScrollUp - Scrolls the current screen up
	   Parameters - TopRow:W, LeftCol:W, BotRow:W, RightCol:W, Lines:W
	                Cell:PW, VioHandle:W
	
	   @VioScrollLf - Scrolls the current screen left
	   Parameters - TopRow:W, LeftCol:W, BotRow:W, RightCol:W, Lines:W
	                Cell:PW, VioHandle:W
	
	   @VioScrollRt - Scrolls the current screen right
	   Parameters - TopRow:W, LeftCol:W, BotRow:W, RightCol:W, Lines:W
	                Cell:PW, VioHandle:W
	
	   @VioWrtNAttr - Writes an attribute to the screen a specified number of
	                  times
	   Parameters - Attr:PB, Times:W, Row:w, Column:W, VioHandle:W
	
	   @VioWrtNCell - Writes a character-attribute (cell) to the screen
	                  a specified number of times
	   Parameters - Cell:PW, Times:W, Row:w, Column:W, VioHandle:W
	
	   @VioWrtNChar - Writes a character to the screen a specified number of
	                  times
	   Parameters - Char:PB, Times:W, Row:w, Column:W, VioHandle:W
	
	   @VioWrtTTy - Writes a character string from the current cursor position
	   Parameters - CharString:PB, Length:W, VioHandle:W
	
	   @VioWrtCharStrAtt - Writes a string of characters with a repeated
	                       attribute to screen
	   Parameters - CharStr:PB, Length:W, Row:W, Column:W, Attr:PB, VioHandle:W
	
	   @VioShowBuf - Updates the physical display with the logical video buffer
	   Parameters - Offset:W, Length:W, VioHandle:W
	
	   @VioSetAnsi - Activates or deactivates ANSI support
	   Parameters - Indicator:W, VioHandle:W
	
	   @VioGetAnsi - Returns the current ANSI state (on or off)
	   Parameters - Indicator:PW, VioHandle:W
	
	   @VioPrtSc - Copies the contents of the screen to the printer
	   Parameters - VioHandle:W
	
	   @VioPrtScToggle - Toggles whether session manager input is sent to printer
	   Parameters - VioHandle:W
	
	   @VioSavRedrawWait - Notifies a process that it must save or redraw
	                       its screen
	   Parameters - SavRedrawIndic:W, NotifyType:PW, VioHandle:W
	
	   @VioSavRedrawUndo - Cancels a VioSavRedrawWait issued by another thread
	                       within the same process
	   Parameters - OwnerIndic:W, KillIndic:W, VioHandle:W
	
	   @VioModeWait - Notifies a graphics application that it must restore its
	                  video mode
	   Parameters - RequestType:W, NotifyType:PW, Reserved:W
	
	   @VioModeUndo - Enables one thread within a process to cancel a VioModeWait
	                  issued by another thread in the same process
	   Parameters - OwnerIndic:W, KillIndic:W, Reserved:W
	
	   @VioScrLock - Locks the screen for I/O
	   Parameters - WaitFlag:W, Status:PB, VioHandle:W
	
	   @VioScrUnLock - Unlocks the screen for I/O
	   Parameters - VioHandle:W
	
	   @VioPopUp - Requests a temporary screen to display a message
	   Parameters - WaitFlags:PW, VioHandle:W
	
	   @VioEndPopUp - Releases a temporary screen obtained from a previous
	                  VioPopUp
	   Parameters - VioHandle:W
	
	   @VioGetConfig - Returns the configuration of the video display
	   Parameters - Reserved:W, ConfigData:PS, VioHandle:W
	   Structure - VIOCONFIGINFO
	
	   @VioGetFont - Returns either the font table of the specified size, or the
	                 font currently in use
	   Parameters - RequestBlock:PS, VioHandle:W
	   Structure - VIOFONTINFO
	
	   @VioSetFont - Downloads a display font
	   Parameters - RequestBlock:PS, VioHandle:W
	   Structure - VIOFONTINFO
	
	   @VioGetCp - Returns the code page being used by the specified handle
	   Parameters - Reserved:W, CodePageID:PW, VioHandle:W
	
	   @VioSetCp - Sets the code page to be used by the specified handle
	   Parameters - Reserved:W, CodePageID:W, VioHandle:W
	
	   @VioGetState - Returns the current setting of either the palette registers
	                  overscan (border) color, or blink/background intensity
	                  switch
	   Parameters - RequestBlock:PS, VioHandle:W
	   Structures - VIOPALSTATE, VIOOVERSCAN, or VIOINTENSITY
	
	   @VioSetState - Sets either the palette registers, overscan (border) color,
	                  or blink/background intensity switch
	   Parameters - RequestBlock:PS, VioHandle:W
	   Structures - VIOPALSTATE, VIOOVERSCAN, or VIOINTENSITY
