---
layout: page
title: "Q37475: User-Defined Character Fonts for Hercules Graphics Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q37475/
---

## Q37475: User-Defined Character Fonts for Hercules Graphics Mode

	Article: Q37475
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 5-JAN-1990
	
	The method described in this article will allow you to display a
	user-defined character set of up to 256 characters in Hercules
	graphics mode. Note that this method works only in Hercules graphics
	mode (SCREEN 3) and does not work under MS OS/2.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	It is possible to modify two assembly-language programs available in
	"Programmer's Guide to PC & PS/2 Video Systems," by Richard Wilton
	(Microsoft Press), to display user-defined character fonts in the
	graphics mode.
	
	The first program, PixelAddrHGC, is Listing 4-3. This program computes
	the starting address of the first pixel for the data to be displayed.
	The main assembly program, DisplayCharHGC, is shown in Listing 9-4.
	
	As written, these programs are meant to interface with Microsoft C. To
	change them to work with BASIC, do the following:
	
	1. Change all near references to far (use medium memory model).
	
	2. Remove the underscore in the public name.
	
	3. Create storage space for VARmask, VARtoggle, and VAR9bits in
	   DGROUP.
	
	4. Reverse the input order of the arguments. Instead of using
	   interrupt vector 43 hex to point to the first 128 characters, and
	   1F hex to point to the font table containing the rest of the
	   characters, use an unused interrupt vector to point to a single
	   table containing 256 characters.
	
	5. Set DS == ES.
	
	The BASIC program below calls a modified form of DisplayCharHGC to
	print a user-defined font to the screen. This program works correctly
	in the QuickBASIC environment and in stand-alone executable form.
	
	The following is a code example:
	
	' $INCLUDE: 'q:qb.bi'
	REM for BASIC PDS 7.00 include QBX.BI instead
	DECLARE SUB DisplayCharHGC (BYVAL A%, BYVAL x%, BYVAL y%,_
	             BYVAL f%, BYVAL b%)
	DEFINT A-Z
	DIM RegX AS RegtypeX
	
	' set table large enough to hold the character set
	DIM table(2048) ' 256 * 8
	
	' table is common to put it in the DGROUP
	COMMON table()
	
	DATA 2,6,14,30,62,126,254,0
	DATA 254,64,32,16,32,64,254,0
	DATA 132,136,158,162,70,130,14,0
	
	CLS
	SCREEN 3
	DEF SEG = VARSEG(table(0))
	FOR i = 1 TO 24
	   READ A%   'Place the created characters into the new
	   POKE VARPTR(table(0)) + i, A%    'graphics table
	NEXT i
	DEF SEG
	
	 'get the initial value at interrupt 50 hex
	   RegX.Ax = &H3550
	   RegX.Ds = -1
	   RegX.Es = -1
	   CALL interruptX(&H21, RegX, RegX)
	   PRINT "Vector 50H was "; RegX.Es, RegX.Bx
	   oldoff& = RegX.Es
	   oldPtr& = RegX.Bx
	
	 ' reset interrupt 50 hex to point to table of characters
	   RegX.Ax = &H2550
	   RegX.Ds = VARSEG(table(0))
	   RegX.Dx = VARPTR(table(0))
	   CALL interruptX(&H21, RegX, RegX)
	
	 ' verify the reset took
	   RegX.Ax = &H3550
	   RegX.Ds = -1
	   RegX.Es = -1
	   CALL interruptX(&H21, RegX, RegX)
	   PRINT "New vector "; RegX.Es, RegX.Bx
	   A% = 10
	
	' print characters
	FOR i = 0 TO 2
	        A% = A% + 1
	        CALL DisplayCharHGC(i, 20, 20 * A%, 0, 7)
	NEXT
	
	'restore original vector
	   RegX.Ds = oldoff&
	   RegX.Dx = oldPtr&
	   RegX.Ax = &H2550
	   CALL interruptX(&H21, RegX, RegX)
	
	'verify restoration
	   RegX.Ax = &H3550
	   RegX.Ds = -1
	   RegX.Es = -1
	   CALL interruptX(&H21, RegX, RegX)
	   PRINT "Vector 50H reset to "; RegX.Es, RegX.Bx
	
	' pause
	   SLEEP
