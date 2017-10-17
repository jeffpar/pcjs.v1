---
layout: page
title: "Q68589: How to Display Mouse Pointer on Multiple Pages, in UI Toolbox"
permalink: /pubs/pc/reference/microsoft/kb/Q68589/
---

## Q68589: How to Display Mouse Pointer on Multiple Pages, in UI Toolbox

	Article: Q68589
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910111-277 B_QuickBas H_Mouse
	Last Modified: 29-JAN-1991
	
	The User Interface (UI) Toolbox demonstration programs supplied with
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 are not written to accomodate mouse support on video pages
	other than page 0 (zero). If you change the SCREEN statement to use
	any video page other than page 0, the mouse cursor (pointer) will not
	be visible. To make the mouse cursor visible, you must call DOS
	interrupt 33 hex.
	
	Note that you may also use interrupt 33 hex with QuickBASIC version
	4.00, 4.00b, and 4.50 to show the mouse cursor on desired video pages.
	
	DOS function 33 hex, with function 1D hex, selects the display page
	for the mouse pointer. Before calling this DOS service, you must load
	the AX register with 1D hexadecimal, and the BX register with the
	desired page number. This page number coincides with the second
	argument to BASIC's SCREEN statement.
	
	Code Example
	------------
	
	Combine (load into QBX.EXE) the following main-module code and
	subprogram along with the MOUSE.BAS source file provided with BASIC
	PDS 7.00 and 7.10.
	
	'$INCLUDE: 'qbx.bi'
	DIM SHARED Regs as Regtype
	MouseShow
	SelectPage(9,0,0)
	SLEEP
	SelectPage(9,1,0)
	END
	SUB SelectPage(Mode%, Page%, Visible%)
	   Regs.AX = &H1D
	   Regs.BX = 0
	   Interrupt &H33, Regs, Regs
	END SUB
