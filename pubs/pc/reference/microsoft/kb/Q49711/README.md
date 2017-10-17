---
layout: page
title: "Q49711: SUB Not Defined; Change CALL MOUSE to MOUSES in MS Press Book"
permalink: /pubs/pc/reference/microsoft/kb/Q49711/
---

## Q49711: SUB Not Defined; Change CALL MOUSE to MOUSES in MS Press Book

	Article: Q49711
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891002-77 docerr B_BasicCom H_DriverPR H_Mouse
	Last Modified: 13-DEC-1989
	
	As specified in the README.TXT file on Disk 2 of the companion disks
	to the "Microsoft Mouse Programmer's Reference" (a Microsoft Press
	release, 1989), the MOUSE routine in MOUSE.LIB has been changed to
	MOUSES (and to MOUSEL, which is not mentioned in the README.TXT).
	MOUSES and MOUSEL are the small- and large-model implementations of
	mouse calls, respectively, and are contained in MOUSE.LIB, which comes
	on the companion disks.
	
	The change of MOUSE to MOUSES affects QuickBASIC Versions 4.00, 4.00b,
	and 4.50 examples in the "Microsoft Mouse Programmer's Reference" that
	call MOUSE through building the QBMOUSE.QLB file (using MOUSE.LIB).
	After creating the QBMOUSE.QLB and trying to execute QBMOU.BAS,
	MOUSE.BAS, PENCIL.BAS, or QBTEST.BAS (from the disk or book), the
	following QuickBASIC error occurs on reference to MOUSE:
	
	   "Subprogram not defined"
	
	This error occurs because there is no routine named MOUSE in
	MOUSE.LIB. To work around this problem, change the CALL (or implied
	CALL) and DECLARE statements from MOUSE to MOUSES or MOUSEL.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 and to Microsoft BASIC Compiler 6.00, and 6.00b for MS-DOS, and
	Microsoft BASIC PDS 7.00 for MS-DOS.
	
	The following specific corrections apply to "Microsoft Mouse
	Programmer's Reference" (published by Microsoft Press, 1989):
	
	1. On Pages 220, 222, 223, and in MOUSE.BAS on the companion disk,
	   change all occurrences of
	
	      CALL MOUSE(m1%, m2%, m3%, m4%)   ' Gives "Subprogram not defined"
	
	   to the following:
	
	      CALL MOUSES(m1%, m2%, m3%, m4%)  ' Small-model mouse CALL works OK
	   or
	      CALL MOUSEL(m1%, m2%, m3%, m4%)  ' Large-model mouse CALL works OK
	
	2. On Pages 212, 213, 214, and in QBMOU.BAS, QBTEST.BAS, and
	   PENCIL.BAS on the companion disk, change all occurrences of
	
	      MOUSE m1, m2, m3, m4         ' Gives "Subprogram not defined"
	
	   to the following:
	
	      MOUSES m1, m2, m3, m4        ' Implicit CALL OK
	   or
	      MOUSEL m1, m2, m3, m4        ' Implicit CALL OK
	
	3. On Pages 214 and 221, and in the QBMOU.BAS, MOUSE.BAS, PENCIL.BAS,
	   and QBTEST.BAS programs on the companion disk, change the DECLARE
	   SUB MOUSE statements to DECLARE SUB MOUSES or DECLARE SUB MOUSEL.
	
	Recommended Method to Call Mouse Functions
	------------------------------------------
	
	As an alternative to linking with the MOUSE.LIB library that is
	provided with the "Microsoft Mouse Programmer's Reference," Microsoft
	recommends the BASIC procedure below to provide the mouse interface.
	This routine uses the CALL INTERRUPT statement to access the mouse via
	interrupt 51.
	
	DEFINT A-Z
	REM $INCLUDE: 'QB.BI'
	REM When using this code in BASIC PDS 7.00, it is necessary
	REM to include the 'QBX.BI' file instead of QB.BI.
	SUB mouse (m0, m1, m2, m3) STATIC
	DIM inregs AS RegType, outregs AS RegType
	    inregs.ax = m0    'Load the registers
	    inregs.bx = m1
	    inregs.cx = m2
	    inregs.dx = m3
	    CALL INTERRUPT(51, inregs, outregs)
	    m0 = outregs.ax
	    m1 = outregs.bx   'Return values from driver
	    m2 = outregs.cx
	    m3 = outregs.dx
	END SUB
