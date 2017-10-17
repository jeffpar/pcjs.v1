---
layout: page
title: "Q42587: QuickBASIC Program to Change the Mouse Shape in Graphics Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q42587/
---

## Q42587: QuickBASIC Program to Change the Mouse Shape in Graphics Mode

	Article: Q42587
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890222-68 B_BasicCom
	Last Modified: 12-DEC-1989
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, and
	Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	The code shown below demonstrates a method of creating a mouse cursor
	of a different shape when in a graphics mode. This example shape is
	taken from Page 7-31 of the "Microsoft Mouse Programmer's Reference
	Guide" and requires an IBM EGA or IBM VGA or compatible graphics
	adapter.
	
	The sample BASIC code on Page 6-15 of the same manual is not
	appropriate for QuickBASIC or the BASIC compiler. The following
	changes must be made:
	
	1. The array "CURSOR" must be dimensioned.
	
	2. The array "CURSOR" must be in a COMMON block.
	
	3. The fourth parameter passed to MOUSE on line 4500 must be
	   VARPTR(CURSOR(0,0))
	
	When using BASIC PDS 7.00 it is also possible to use the MOUSEDRIVER
	SUBprogram in the MOUSE.BAS portion of the User Interface Toolbox
	(rather then the CALL INTERRUPT method shown below) to change the
	mouse pointer shape.
	
	Code Example
	------------
	
	DECLARE SUB mouse (m1%, m2%, m3%, m4%)
	DECLARE FUNCTION MouseInit% ()
	DECLARE SUB MouseShow ()
	DECLARE SUB MouseButPos (ButStat%, CurHor%, CurVert%)
	
	' The following $INCLUDE filename would be 'QBX.BI' if you
	' are using the BASIC PDS 7.00:
	' $INCLUDE: 'qb.bi'
	
	DEFINT A-Z
	DIM cursor(16, 2)
	COMMON cursor()
	' Data for an HOUR Glass shape
	'Array Screen Mask             binary
	Cursor(0, 0) = &H07E0         '0000011111100000
	Cursor(1, 0) = &H0180         '0000000110000000
	Cursor(2, 0) = &H0000         '0000000000000000
	Cursor(3, 0) = &HC003         '1100000000000011
	Cursor(4, 0) = &HF00F         '1111000000001111
	Cursor(5, 0) = &HC003         '1100000000000011
	Cursor(6, 0) = &H0000         '0000000000000000
	Cursor(7, 0) = &H0180         '0000000110000000
	Cursor(8, 0) = &H07E0         '0000011111100000
	Cursor(9, 0) = &HFFFF         '1111111111111111
	Cursor(10 0) = &HFFFF         '1111111111111111
	Cursor(11, 0) = &HFFFF        '1111111111111111
	Cursor(12, 0) = &HFFFF        '1111111111111111
	Cursor(13, 0) = &HFFFF        '1111111111111111
	Cursor(14, 0) = &HFFFF        '1111111111111111
	Cursor(15, 0) = &HFFFF        '1111111111111111
	
	' Cursor mask                 binary
	Cursor(0, 1) = &H0000         '0000000000000000
	Cursor(1, 1) = &H700E         '0111000000001110
	Cursor(2, 1) = &H1C38         '0001110000111000
	Cursor(3, 1) = &H0660         '0000011001100000
	Cursor(4, 1) = &H03C0         '0000001111000000
	Cursor(5, 1) = &H0660         '0000011001100000
	Cursor(6, 1) = &H1C38         '0001110000111000
	Cursor(7, 1) = &H700E         '0111000000001110
	Cursor(8, 1) = &H0000         '0000000000000000
	Cursor(9, 1) = &H0000         '0000000000000000
	Cursor(10, 1) = &H0000        '0000000000000000
	Cursor(11, 1) = &H0000        '0000000000000000
	Cursor(12, 1) = &H0000        '0000000000000000
	Cursor(13, 1) = &H0000        '0000000000000000
	Cursor(14, 1) = &H0000        '0000000000000000
	Cursor(15, 1) = &H0000        '0000000000000000
	
	Button$(0) = "Left Up   / Right Up  "
	Button$(1) = "Left Down / Right Up  "
	Button$(2) = "Left Up   / Right Down"
	Button$(3) = "Left Down / Right Down"
	
	SCREEN 9
	' this part initializes the mouse
	IF MouseInit = 0 THEN
	  PRINT "can not initialize mouse"
	  END
	END IF
	
	' this is the part that makes the shape
	m1 = 9
	m2 = 7
	m3 = 7
	m4 = VARPTR(cursor(0, 0))
	CALL mouse(m1, m2, m3, m4)
	
	' this call turns the mouse cursor on
	MouseShow
	
	LOCATE 10, 10: PRINT "Button Status :";
	LOCATE 11, 10: PRINT "Horizontal pos :";
	LOCATE 12, 10: PRINT "Vertical pos  :";
	
	WHILE INKEY$ = ""
	CALL MouseButPos(ButStat, CurHor, CurVert)
	
	LOCATE 10, 25: PRINT Button$(ButStat)
	LOCATE 11, 25: PRINT CurHor
	LOCATE 12, 25: PRINT CurVert
	WEND
	
	SUB mouse (m1, m2, m3, m4)
	  DIM InRegs AS RegType
	  InRegs.ax = m1
	  InRegs.bx = m2
	  InRegs.cx = m3
	  InRegs.dx = m4
	  CALL INTERRUPT(51, InRegs, InRegs)
	  m1 = InRegs.ax
	  m2 = InRegs.bx
	  m3 = InRegs.cx
	  m4 = InRegs.dx
	
	END SUB
	
	SUB MouseButPos (ButStat, CurHor, CurVert)
	  m1 = 3
	  CALL mouse(m1, m2, m3, m4)
	  ButStat = m2
	  CurHor = m3
	  CurVert = m4
	END SUB
	
	FUNCTION MouseInit
	   m1 = 0
	   CALL mouse(m1, m2, m3, m4)
	   MouseInit = m1
	
	END FUNCTION
	
	SUB MouseShow
	  m1 = 1
	  CALL mouse(m1, m2, m3, m4)
	
	END SUB
