---
layout: page
title: "Q65515: BASIC OS/2 Routines to Replace UIASM.ASM for UI ToolBox"
permalink: /pubs/pc/reference/microsoft/kb/Q65515/
---

## Q65515: BASIC OS/2 Routines to Replace UIASM.ASM for UI ToolBox

	Article: Q65515
	Version(s): 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S900821-212
	Last Modified: 21-SEP-1990
	
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 provide sample User Interface (UI) Toolbox code written
	mostly in BASIC, with a few sections written in assembler. The code is
	written specifically for MS-DOS and does not support OS/2 unless the
	code is modified.
	
	The UI Toolbox uses three assembler routines to provide direct video
	access to get a window (GetCopyBox), put a window (PutCopyBox), and
	change the attributes of a window (AttrBox). These routines are
	located in the UIASM.ASM source file. These three routines do not work
	under OS/2 unless you modify them for OS/2 IOPL (Input Output
	Privileges) support, or rewrite them in BASIC using OS/2 Video I/O
	(VIO) API calls.
	
	The following code example provides one way to replace these three
	assembler routines with BASIC code utilizing the OS/2 VIO API Calls.
	
	Since this code is written in BASIC, you will need to compile these
	routines with the same options you use on the modules that call them.
	These compiler options include near/far strings, protected mode, and
	alternate/emulation math.
	
	GetCopyBox, PutCopyBox, AttrBox are currently written in assembly
	language (in UIASM.ASM on the 7.00 and 7.10 release disk) for greater
	speed. The UIASM.BAS program below contains the equivalent BASIC
	routines using OS/2 VIO API calls. Since the code is written in BASIC,
	the speed may be notably slower compared to straight assembler code.
	Also, the multitasking nature of OS/2 adds overhead compared to
	running the same program under MS-DOS.
	
	GetCopyBOX and PutCopyBox uses the MID$() statement and function to
	modify the Screen Buffer variable to store and restore the screen
	contents. An "Illegal Function Call" error may occur at run time if
	the size of the window is zero (0) bytes.
	
	UIASM.BAS
	---------
	
	'| The module below contains the following three BASIC procedures:
	'|
	'|  DECLARE SUB GetCopyBox (ULRow%, ULCow%, LRRow%, LRCol%, buffer$)
	'|  GetCopyBox -- Gets screen box info and places the info into a
	'|                string variable.
	'|
	'|  DECLARE SUB PutCopyBox (ULRow%, ULCow%, buffer$)
	'|  PutCopyBox -- Puts screen box info back on the screen from a
	'|                string variable.
	'|
	'|  DECLARE SUB AttrBox (ULRow%, ULCow%, LRRow%, LRCol%, NewAttr%)
	'|  AttrBox -- Changes the color attributes of all characters within
	'|             a box.
	'|
	'| In the above parameter lists, the beginning two characters specify the
	'| portion of the rectangle of the box being referred to, as follows:
	'|      UL = Upper-left corner of the rectangle/box
	'|      LR = Lower-right corner of the rectangle/box
	'
	' Below are DECLARE Statements for the OS/2 VIO (Video I/O) routines:
	DECLARE FUNCTION VioReadCellStr% ( BYVAL    CellAdd&,      _
	                                   SEG      NumCells%,     _
	                                   BYVAL    SRow%,         _
	                                   BYVAL    SCol%,         _
	                                   BYVAL    VidHandle%  )
	DECLARE FUNCTION VioWrtCellStr%  ( BYVAL    CellAdd&,      _
	                                   BYVAL    NumCells%,     _
	                                   BYVAL    SRow%,         _
	                                   BYVAL    SCol%,         _
	                                   BYVAL    VidHandle%  )
	SUB GetCopyBox (ULRow%, ULCol%, LRRow%, LRCol%, ScreenBuffer$)
	    '| Subtract 1 from all screen coordinates to reflect the difference
	    '| between BASIC's screen BASE 1 and the VIO API BASE 0.
	    '| We also make a copy of the variables, since we do not force the
	    '| caller to use BYVAL or by reference calling convention.
	    '|    UL = Upper-left corner of the rectangle/box
	    '|    LR = Lower-right corner of the rectangle/box
	    URow% = ULRow% - 1
	    UCol% = ULCol% - 1
	    LRow% = LRRow% - 1
	    LCol% = LRCol% - 1
	    '| Find width and height of the Box
	    BoxHeigth% = LRow% - URow% + 1
	    BoxWidth% = LCol% - UCol% + 1
	    '| Calculate the actual width of the line before the FOR-loop
	    '| thus performing the operation once. We need a copy of the
	    '| results, since the function call changes the value of
	    '| parameter passed to it.
	    ActualWidth% = BoxWidth% * 2
	    OldBoxWidth% = ActualWidth%
	    FOR i% = URow% to LRow%
	        Work$ = Space$ (ActualWidth%)
	        '| Read one line from the Box of BoxWidth% long into
	        '| a Work String. The format of the string is
	        '| character + attribute (every two bytes make a cell)
	        VIORt% = VioReadCellStr ( SSEGADD (Work$), _
	                                  ActualWidth%,    _
	                                  i%,              _
	                                  UCol%,           _
	                                  VideoHandle%  )
	        '| VioReadCellStr changes the value "ActualWidth%" to reflect
	        '| how many characters were actually placed into the buffer.
	        '| We reset the value after every call, so we don't lose one
	        '| character and attribute each time through the FOR-Loop.
	        ActualWidth% = OldBoxWidth%
	        '| We calculate the offset into the string where we
	        '| will place the line of text.
	        ScrnOff% = ActualWidth% * (i% - URow%) + 3
	        '| By using the MID$ statement, we can place the information
	        '| over the existing information with little work on our part.
	        Mid$ (ScreenBuffer$, ScrnOff%, Len (Work$) ) = Work$
	    Next i%
	    '| Store the Width and Height of the BOX in the first
	    '| two characters of the buffer. The Height will be on the
	    '| BASE of ONE, and PutCopyBox will convert it to a BASE zero.
	    Mid$(ScreenBuffer$, 1, 1) = chr$(BoxWidth%)
	    Mid$(ScreenBuffer$, 2, 1) = chr$(BoxHeigth%)
	END SUB
	
	SUB PutCopyBox (ULRow%, ULCol%, ScreenBuffer$)
	    '| Subtract 1 from all screen coordinates to reflect the difference
	    '| between BASIC's screen BASE 1 and the VIO API BASE 0.
	    '| We also make a copy of the variables, since we do not force the
	    '| caller to use the BYVAL or by reference calling convention.
	    '|    UL = Upper-left corner of the rectangle/box
	    '|    LR = Lower-right corner of the rectangle/box
	    URow% = ULRow% - 1
	    UCol% = ULCol% - 1
	    '| The first two bytes are the Width and Height used by GetCopyBox.
	    '| Where the Height is from BASE 1 rather then ZERO
	    BoxWidth%  = ASC(Mid$ (ScreenBuffer$, 1, 1))
	    BoxHeigth% = ASC(Mid$ (ScreenBuffer$, 2, 1)) - 1
	    '| We calculate the actual width of the line before the loop,
	    '| rather than inside the loop.
	    ActualWidth% = BoxWidth% * 2
	    FOR i% = 0 to BoxHeigth%
	        '| Calculate the offset into the string for each line of the box.
	        ScrnOff% = ActualWidth% * i% + 3
	        '| The actual row on the screen that we are printing to:
	        NewRow% = URow% + i%
	        '| We extract a line of text with the attributes in a
	        '| similar manner to how we placed them in the string:
	        Work$ = Mid$ (ScreenBuffer$, ScrnOff%, ActualWidth%)
	        '| Write the line of text and attributes to the screen:
	        VIORt% = VioWrtCellStr ( SSEGADD (Work$),  _
	                                 ActualWidth%      _
	                                 NewRow%,          _
	                                 UCol%,            _
	                                 VideoHandle%   )
	    Next i%
	END SUB
	
	SUB AttrBox (ULRow%, ULCol%, LRRow%, LRCol%, NewAttr%)
	    '| Subtract 1 from all screen coordinates to reflect the difference
	    '| between BASIC's screen BASE 1 and the VIO API BASE 0.
	    '| We also make a copy of the variables, since we do not force the
	    '| caller to use the BYVAL or by reference calling convention.
	    '|    UL = Upper-left corner of the rectangle/box
	    '|    LR = Lower-right corner of the rectangle/box
	    URow% = ULRow% - 1
	    UCol% = ULCol% - 1
	    LRow% = LRRow% - 1
	    LCol% = LRCol% - 1
	    '| Find width and height of the Box:
	    BoxHeigth% = LRow% - URow% + 1
	    BoxWidth% = LCol% - UCol% + 1
	    '| Calculate the actual width of the line before the FOR-loop,
	    '| thus performing the operation once. We need a copy of the
	    '| results, since the function call changes the value of
	    '| parameter passed to it.
	    ActualWidth% = BoxWidth% * 2
	    OldBoxWidth% = ActualWidth%
	    FOR i% = URow% to LRow%
	        Work$ = Space$ (ActualWidth%)
	        '| Read one line from the Box of BoxWidth% long into
	        '| a Work String. The format of the string is
	        '| character + attribute (every two bytes make a cell)
	        VIORt% = VioReadCellStr ( SSEGADD (Work$), _
	                                  ActualWidth%,    _
	                                  i%,              _
	                                  UCol%,           _
	                                  VideoHandle%   )
	        '| VioReadCellStr changes the value "ActualWidth%" to reflect
	        '| how many characters were actually placed into the buffer.
	        '| We reset the value after every call, so we don't lose one
	        '| character and attribute each time through the FOR-Loop.
	        ActualWidth% = OldBoxWidth%
	        For j% = 2 to ActualWidth% STEP 2
	            Mid$(Work$, j%, 1) = chr$ (NewAttr%)
	        Next j%
	        VIORt% = VioWrtCellStr ( SSEGADD (Work$), _
	                                 ActualWidth%,    _
	                                 i%,              _
	                                 UCol%,           _
	                                 VideoHandle%   )
	    Next i%
	END SUB
