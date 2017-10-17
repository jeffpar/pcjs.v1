---
layout: page
title: "Q32725: PEN Function Returns Mouse Cursor Position in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q32725/
---

## Q32725: PEN Function Returns Mouse Cursor Position in BASIC

	Article: Q32725
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	If the Microsoft MOUSE.SYS driver is installed, the PEN function gives
	the Microsoft Mouse cursor position in both character (row and column)
	and graphics (pixel) coordinates. The following values for PEN are
	meaningful when using the mouse, but only if both buttons are pressed:
	
	   PEN(4), PEN(5), PEN(8) and PEN(9)
	
	You need to test if PEN(3) equals -1 to verify that both buttons are
	pushed.
	
	This article applies to Microsoft QuickBASIC Versions 4.00, 4.00b and
	4.50, to Microsoft BASIC Compiler Version 6.00 for MS-DOS and MS OS/2,
	and to Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	Pages 314 and 315 of the "Microsoft QuickBASIC 4.0: BASIC Language
	Reference" manual for Versions 4.00 and 4.00b describe the values
	returned by the PEN function when using the mouse.
	
	Please note that MOUSE CALLs provide a much better mouse interface to
	QuickBASIC than the PEN function. MOUSE CALLs are documented in the
	"Microsoft Mouse Programmer's Reference Guide," which can be ordered
	using the order blank enclosed in the Microsoft Mouse package.
	
	The following is a code example:
	
	CLS
	PRINT "Press both buttons to trap mouse position. Press any key to end."
	DO WHILE INKEY$ = ""
	        IF PEN(3) = -1 THEN
	                LOCATE 10, 1
	                PRINT "Row:"; PEN(8)
	                PRINT "Column"; PEN(9)
	                PRINT "X Pixel"; PEN(4)
	                PRINT "Y Pixel"; PEN(5)
	        END IF
	LOOP
