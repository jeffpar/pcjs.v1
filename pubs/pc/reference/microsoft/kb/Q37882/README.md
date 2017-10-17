---
layout: page
title: "Q37882: Call Microsoft MOUSE from QB 4.x Using Assembler, INTERRUPT"
permalink: /pubs/pc/reference/microsoft/kb/Q37882/
---

## Q37882: Call Microsoft MOUSE from QB 4.x Using Assembler, INTERRUPT

	Article: Q37882
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	This article demonstrates how to use CALL INTERRUPT in a BASIC program
	to make Microsoft Mouse function calls.
	
	The information in this article applies to Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50, to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS, and to Microsoft BASIC PDS Version 7.00 for
	MS-DOS.
	
	The interrupt 51 for the Microsoft Mouse Versions 6.00 and later is
	documented in the following book:
	
	   "Advanced MS-DOS Programming," Second Edition, by Ray Duncan
	   (Microsoft Press, 1988) Pages 593-611. (The first edition published
	   in 1986 did not document the mouse interrupt.)
	
	For more information regarding making mouse calls from BASIC, see the
	"Microsoft Mouse Programmer's Reference Guide," which can be ordered
	from Microsoft Customer Service by calling (206) 882-8088.
	
	Note: Throughout the rest of this article, if you are using Microsoft
	BASIC PDS 7.00, the include file QBX.BI should be substituted for
	QB.BI, the Quick library QBX.QLB should be used instead of QB.QLB, and
	the library QBX.LIB should be used in place of QB.LIB.
	
	To use the mouse in compiled BASIC programs, the program must be able
	to talk to the mouse driver. This is done by using the mouse interrupt
	51 (33 hex), passing up to four integer parameters in the AX, BX, CX,
	and DX registers. This can be accomplished by using either the CALL
	INTERRUPT statement in QuickBASIC, or by directly CALLing assembly
	language routines that perform the interrupt calls and return the
	information from the mouse driver.
	
	For more information on using CALL INTERRUPT to access the mouse,
	query on the following keywords in this database:
	
	   call and mouse and interrupt
	
	For more detailed information on how to use INTERRUPT and INTERRUPTX
	query on the keyword QB4INT.
	
	To use an assembly language routine to make the mouse function calls,
	you can replace the MOUSE subprogram below with the assembly language
	listing, also shown below. This eliminates the need for the QB.BI
	include file, and the QB.QLB/QB.LIB libraries. However, you will have
	to place the assembly routine in another Quick library and a parallel
	conventional library.
	
	The mouse information is obtained by various mouse function calls.
	When using the mouse interrupt, the mouse function call number is
	passed to the mouse driver in AX, and other information that the
	driver may need is passed in BX, CX, and/or DX. The commonly used
	mouse functions are as follows:
	
	   Function
	   Number          Function
	   ------          --------
	
	   0               Mouse reset and status
	   1               Show mouse cursor
	   2               Hide mouse cursor
	   3               Get cursor position and button status
	   4               Set cursor position
	   7               Set Horizontal Minimum/Maximum
	   8               Set Vertical Minimum/Maximum
	
	Below are a series of BASIC routines that execute the function calls
	mentioned above. Each routine makes a call to a subprogram named
	MOUSE, which in turn executes an interrupt 51.
	
	The following are BASIC routines:
	
	DEFINT A-Z
	'$INCLUDE: 'qb.bi'
	' Note: include QBX.BI for BASIC PDS 7.00
	'---------------------------------------------------------------------
	'---                                                               ---
	'--- Mouse Library Routine Declarations                            ---
	'---                                                               ---
	'---------------------------------------------------------------------
	
	DECLARE SUB Mouse (M0%, M1%, M2%, M3%)
	DECLARE SUB MouseOn ()
	DECLARE SUB MouseOff ()
	DECLARE SUB HideMouse ()
	DECLARE SUB ShowMouse ()
	DECLARE SUB GetMXY (mx%, my%)
	DECLARE SUB SetMXY (mx%, my%)
	DECLARE SUB MBorders (x%, y%, h%, v%)
	DECLARE FUNCTION MBtn% ()
	DECLARE FUNCTION MouseActive% ()
	
	'------- Get Text Mode coordinates --------
	SUB GetMXY (x, y) STATIC
	  Mouse 3, 0, x, y                      'get GRAPHIC coordinates
	  x = (x / 8) + 1                       'convert to TEXT coordinates
	  y = (y / 8) + 1
	END SUB
	
	'------- Hide the Mouse Cursor -------
	SUB HideMouse STATIC
	  call Mouse (2, 0, 0, 0)
	END SUB
	
	'------- Set Horizontal Minimum/Maximum -----
	'------- Set Vertical Minimum/Maximum -------
	SUB MBorders (x, y, h, v) STATIC
	  Mouse 7, 0, (x - 1) * 8, (h - 1) * 8
	  Mouse 8, 9, (y - 1) * 8, (v - 1) * 8
	END SUB
	
	'------- Return Button Status -------
	FUNCTION MBtn% STATIC
	  Mouse 3, Buttons, 0, 0
	  MBtn% = Buttons
	END FUNCTION
	
	'------- Mouse Interrupt ------
	SUB Mouse (M0%, M1%, M2%, M3%) STATIC
	  DIM InRegs AS RegType, OutRegs AS RegType
	  InRegs.ax = M0%
	  InRegs.bx = M1%
	  InRegs.cx = M2%
	  InRegs.dx = M3%
	  CALL INTERRUPT(51, InRegs, OutRegs)
	  M0% = OutRegs.ax
	  M1% = OutRegs.bx
	  M2% = OutRegs.cx
	  M3% = OutRegs.dx
	END SUB
	
	'------- Mouse Driver Active --------
	FUNCTION MouseActive% STATIC
	  DEF SEG = 0
	  mseg% = 256 * PEEK(51 * 4 + 3) + PEEK(51 * 4 + 2)
	  moff% = 256 * PEEK(51 * 4 + 1) + PEEK(51 * 4)
	  IF mseg% OR moff% THEN
	    DEF SEG = mseg%
	    IF PEEK(moff%) = 207 THEN
	      MouseActive% = 0
	    ELSE
	      MouseActive% = -1
	    END IF
	  ELSE
	    MouseActive% = 0
	  END IF
	  DEF SEG
	END FUNCTION
	
	'------- Turn Mouse Off -------
	SUB MouseOff STATIC
	  Mouse 0,0,0,0
	END SUB
	
	'------- Turn Mouse On --------
	SUB MouseOn STATIC
	  Mouse 0, 0, 0, 0                      'initialize mouse driver
	  Mouse 1, 0, 0, 0                      'turn mouse cursor on
	END SUB
	
	'------- Set Mouse Coordinates --------
	SUB SetMXY (x, y) STATIC
	  Mouse 4, 0, (x - 1) * 8, (y - 1) * 8
	END SUB
	
	'------ Draw Mouse Cursor -------
	SUB ShowMouse STATIC
	  Mouse 1, 0, 0, 0
	END SUB
	
	The following is the assembly language counterpart to the MOUSE
	subprogram shown above. This routine can be placed in a Quick library
	and a conventional .LIB library, and your program can make calls to
	this routine, which will directly interface with the mouse driver,
	eliminating the need for the CALL INTERRUPT routine.
	
	This assembly listing should be compiled with Microsoft Macro
	Assembler (MASM) Version 5.00 or later.
	
	;MOUSE.ASM
	.MODEL  medium
	.DATA
	bxhold    dw    ?
	.CODE
	
	    public Mouse
	Mouse   proc    far
	        push    bp
	        mov     bp, sp
	        mov     bx, [bp+10]        ;get BX parameter
	        mov    ax, [bx]           ;in AX
	        mov    bxhold, ax       ;and save
	    mov    bx, [bp+6]
	    mov    dx, [bx]       ;get DX parm
	    mov    bx, [bp+8]
	    mov    cx, [bx]       ;get CX parm
	    mov    bx, [bp+12]
	    mov    ax, [bx]       ;get AX parm
	    mov    bx, bxhold       ;get BX back
	    int    51           ;make the MOUSE call
	    mov    bxhold, bx
	    mov    bx, [bp+6]
	    mov    [bx], dx       ;return DX
	    mov    bx, [bp+8]
	    mov    [bx], cx       ;return CX
	    mov    bx, [bp+12]
	    mov    [bx], ax       ;return AX
	    mov    bx, [bp+10]
	    mov    ax, bxhold
	    mov    [bx], ax       ;return BX
	    pop    bp
	    ret    8           ;remove 4 parameters from stack
	Mouse    endp
	END
