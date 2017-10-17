---
layout: page
title: "Q28171: Calling Interrupts to Program Microsoft Mouse from QuickBASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q28171/
---

## Q28171: Calling Interrupts to Program Microsoft Mouse from QuickBASIC

	Article: Q28171
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 17-FEB-1989
	
	The software interrupt routines, CALL INTERRUPT and CALL INT86old,
	provide access to the DOS system services. These statements let you
	make calls to the Microsoft Mouse through interrupt 51 (i.e., 33 hex).
	Mouse function calls are useful for detecting the position of the
	mouse, detecting the status of the mouse buttons, changing the mouse
	cursor shape, changing the video page for the cursor, and other
	functions.
	
	Calling the mouse through interrupts as shown below is more flexible
	than calling the MOUSE routine from the MOUSE.LIB library on the
	Microsoft Mouse disk because you don't need to worry about MOUSE.LIB
	changing from version to version.
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, 4.50 and
	the Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (real mode). The second example below can be used in QuickBASIC
	Version 2.00, 2.01, or 3.00 if you change the statement INT86old to
	INT86. INT86old is provided in QuickBASIC Versions 4.00, 4.00b, 4.50,
	and in the BASIC compiler Versions 6.00 and 6.00b for compatibility
	with earlier QuickBASIC programs that use INT86.
	
	CALL INTERRUPT and CALL INT86old can be used to access the ROM BIOS
	and DOS-system service routines. These routines provide a range of
	mouse, keyboard, video, and DOS services.
	
	The examples below let you draw in high-resolution graphics mode
	with the Microsoft Mouse. The mouse driver (MOUSE.COM) must be
	installed before running these programs. MOUSE.COM is provided with
	QuickBASIC.
	
	The INTERRUPT and INT86old routines are considered external
	subroutines by the compiler. The routines are located in the files
	QB.LIB and QB.QLB. Programs that execute a CALL INTERRUPT or CALL
	INT86old statement when compiled in the QB.EXE editor require the
	presence of the QB.QLB quick library. This means that QB.EXE must be
	invoked with the /L option. EXE programs that execute these statements
	must be linked with the file QB.LIB. More information on the use of
	CALL INTERRUPT and CALL INT86old can be found under the CALL statement
	in the "Microsoft BASIC Language Reference."
	
	Access to the software interrupts adds tremendous flexibility to BASIC
	programs. However, care should be taken because BASIC does no error
	checking for interrupt calls.
	
	The interrupt 51 for Microsoft Mouse Version 6.00 (and later) is
	documented in the following book:
	
	"Advanced MS-DOS Programming," Second Edition, by Ray Duncan
	(published by Microsoft Press, 1988). Pages 593-611. (The first
	edition, published in 1986, does not document the mouse interrupt.)
	
	More information regarding making mouse calls from BASIC can be found
	in the "Mouse Programmer's Reference Guide," which can be ordered from
	Microsoft Customer Service by calling (206) 882-8088.
	
	Note that you can invoke mouse interrupt 51 with function 29 (1D hex),
	"Select pointer page", to change the video display page for the mouse
	cursor. The valid page numbers depend on the current SCREEN mode. To
	change the video page of the mouse cursor in the examples below, CALL
	the MOUS subprogram as follows:
	
	   pagenum%=0   ' Change to appropriate video page for current SCREEN.
	   CALL mous (29, pagenum%, 0, 0)
	
	The following are two code examples:
	
	1. The following code example uses the CALL INTERRUPT statement to
	   call the Microsoft Mouse in QuickBASIC Versions 4.00, 4.00b, 4.50
	   or in the Microsoft BASIC Compiler Versions 6.00 or 6.00b for MS-DOS
	   or MS OS/2 real mode:
	
	DECLARE SUB MOUS (m0%, m1%, m2%, m3%)
	DEFINT A-Z
	TYPE regtype
	    ax AS INTEGER
	    bx AS INTEGER
	    cx AS INTEGER
	    dx AS INTEGER
	    BP AS INTEGER
	    SI AS INTEGER
	    DI AS INTEGER
	    FLAGS AS INTEGER
	    DS AS INTEGER
	    ES AS INTEGER
	END TYPE
	
	SCREEN 2
	m0 = 0: m1 = 0: m2 = 0: m3 = 0: oldx = 0: oldy = 0
	CALL MOUS(m0, m1, m2, m3)             'initialize mouse
	m0 = 1
	INPUT "press any key to turn on mouse cursor:", x
	CALL MOUS(m0, m1, m2, m3)             'turn on mouse cursor
	END
	SUB MOUS (m0, m1, m2, m3) STATIC
	  DIM inary AS regtype
	  DIM outary AS regtype
	  inary.ax = m0: inary.bx = m1: inary.cx = m2: inary.dx = m3
	  CALL interrupt(51, inary, outary)
	  m0 = outary.ax: m1 = outary.bx: m2 = outary.cx: m3 = outary.dx
	END SUB
	
	2. The following code example uses the CALL INT86old statement to call
	   the Microsoft Mouse. (Note that the INT86old found in QuickBASIC
	   Versions 4.00 and 4.00b is compatible with QuickBASIC Versions
	   2.00, 2.01, and 3.00 programs that use INT86. You can run this
	   program in QuickBASIC Versions 2.x and 3.00 by changing INT86old to
	   INT86 and removing the DECLARE statement. (Conversely, you can run
	   QuickBASIC Version 2.x or 3.00 programs in Version 4.00, 4.00b, or
	   4.50 by changing INT86 to INT86old.)
	
	DECLARE SUB MOUS (m0%, m1%, m2%, m3%)
	DEFINT A-Z
	SCREEN 2
	m0 = 0: m1 = 0: m2 = 0: m3 = 0: oldx = 0: oldy = 0
	CALL MOUS(m0, m1, m2, m3)                   'initialize mouse
	m0 = 1
	INPUT "Press ENTER key to turn on mouse cursor:", x
	CALL MOUS(m0, m1, m2, m3)                   'turn on mouse cursor
	END
	SUB MOUS (m0, m1, m2, m3) STATIC
	  DIM regs(7)
	  regs(0) = m0: regs(1) = m1: regs(2) = m2: regs(3) = m3
	  CALL int86old(51, regs(), regs())
	  m0 = regs(0): m1 = regs(1): m2 = regs(2): m3 = regs(3)
	END SUB
