---
layout: page
title: "Q30856: How to Make MOUSE CALLs in Hercules Graphics Mode, SCREEN 3"
permalink: /pubs/pc/reference/microsoft/kb/Q30856/
---

## Q30856: How to Make MOUSE CALLs in Hercules Graphics Mode, SCREEN 3

	Article: Q30856
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom H_Mouse H_DriverPR docerr
	Last Modified: 1-DEC-1989
	
	You can design BASIC programs that make CALLs to the Microsoft Mouse
	driver on Hercules Monochrome SCREEN 3 in MS-DOS, but you must follow
	the steps below. (MOUSE CALLs let you change the mouse cursor, detect
	the mouse position, detect mouse-button status, etc.)
	
	Appendix D of the "Microsoft Mouse Programmer's Reference Guide"
	mentions three steps, but they are shown in the wrong order to work
	with QuickBASIC. The steps shown on Page D-1 should be performed in
	the following order for QuickBASIC:
	
	   2, 3, 1
	
	The order 1, 2, 3 should be used for other languages.
	
	The following information applies to QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and Microsoft BASIC Compiler Versions 6.00 and 6.00b running
	under MS-DOS.
	
	When making CALLs to the Microsoft Mouse driver on a computer with a
	Hercules Monochrome Graphics Adapter, do the following:
	
	1. In the AUTOEXEC.BAT file, invoke the Microsoft MOUSE.COM driver
	   before the QBHERC.COM or MSHERC.COM Hercules Graphics driver. If
	   QBHERC or MSHERC is mistakenly loaded first, the Hercules graphics
	   cursor appears as several small horizontal (broken) lines in the
	   graphics screen (or it does not appear at all), and the graphics
	   drawing boundaries are confined to 640 x 200 pixels. (Normal SCREEN
	   3 resolution is 720 x 348.)
	
	   MSHERC.COM is shipped with QuickBASIC Version 4.50. QBHERC.COM is
	   shipped with Microsoft QuickBASIC Versions 4.00 and 4.00b and with
	   Microsoft BASIC Compiler Versions 6.00 and 6.00b.
	
	2. Perform one of the following steps, but not both:
	
	   a. Start QB.EXE by typing QB /L MOUSE to load the Quick Library
	      MOUSE.QLB into memory.
	
	      You can use LINK /Q to make MOUSE.QLB from the MOUSE.LIB that
	      comes on a disk along with the "Microsoft Mouse Programmer's
	      Reference Guide." This guide can be ordered by returning the
	      card in the Microsoft Mouse package.
	
	   -- or --
	
	   b. Start QB.EXE by typing QB /L QB.QLB and use CALL INTERRUPT or
	      CALL INT86OLD to access the mouse driver. To find out how to
	      use CALL INTERRUPT or CALL INT86OLD to program the mouse,
	      search for a separate article with the following words:
	
	         INTERRUPT and INT86OLD and 51 and MOUSE
	
	3. To tell the mouse driver that you are in CRT Page 0, define the
	   segment address (DEF SEG) at hex 40 and POKE a 6 into offset hex
	   49. You must store 5 into memory offset hex 49 to use CRT Page 1.
	   The following is an example:
	
	      DEF SEG = &H40
	      POKE &H49, 6          ' CRT page 0
	      DEF SEG
	
	4. Call the mouse function 0 to initialize, as follows:
	
	      CALL mouse(0,0,0,0)     '  initialize mouse
	
	5. Put the card into the graphics mode (i.e., change to SCREEN mode
	   3), as follows:
	
	      SCREEN 3, , 0, 0
	
	6. CALL the mouse to turn the mouse cursor on, as follows:
	
	      CALL mouse(1, 0, 0, 0)     '  turn mouse cursor on
	
	QuickBASIC Versions 3.00 and earlier do not support Hercules
	Monochrome Graphics SCREEN 3.
	
	The techniques explained in this article do not work under the DOS box
	(real mode) of MS OS/2 (nor do they work in protected mode, which
	requires OS/2 MOU... API function calls from Microsoft BASIC Compiler
	6.00 or 6.00b to program the mouse). OS/2 normally loads its own mouse
	driver for the DOS box, and even if this driver isn't loaded, OS/2
	still reserves interrupt 33 for itself. If you install MOUSE.COM in
	the DOS box, OS/2 will tell you that the interrupt is owned by the
	system, and although a program can display the mouse cursor on
	Hercules SCREEN 3 (such as the Code Example below), the pointer will
	not move. You cannot program the mouse in Hercules graphics SCREEN 3
	in the DOS box (real mode) of MS OS/2. You can, however, program the
	mouse in other graphics screen modes in the DOS box of OS/2.
	
	Code Example
	------------
	
	The following example can be compiled with QuickBASIC Versions 4.00,
	4.00b, and 4.50 and with Microsoft BASIC Compiler Versions 6.00 and
	6.00b in MS-DOS:
	
	DEFINT A-Z
	DEF SEG = &H40
	POKE &H49, 6               ' CRT page 0
	DEF SEG
	CALL mouse(0, 0, 0, 0)     ' Initialize Mouse
	SCREEN 3, , 0, 0           ' Switch to Hercules Graphics mode, page 0
	
	m1 = 1
	CALL mouse(m1, m2, m3, m4)   ' Turn on mouse cursor (m1 = 1)
	WHILE INKEY$="":WEND
	CALL mouse(2, 0, 0, 0)       ' Turn off mouse cursor
	END
