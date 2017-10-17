---
layout: page
title: "Q31936: Example of Using SetUEvent, ON UEVENT to Detect Mouse Presence"
permalink: /pubs/pc/reference/microsoft/kb/Q31936/
---

## Q31936: Example of Using SetUEvent, ON UEVENT to Detect Mouse Presence

	Article: Q31936
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 17-JAN-1991
	
	The following example uses the SetUEvent routine and the ON UEVENT
	statement to trap a user-defined event. An event occurs in the sample
	program below if the Microsoft Mouse is not installed. The program
	traps the event if and when it occurs, and then prints a message.
	
	The user-defined event-trapping feature is found in QuickBASIC version
	4.00b, Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS,
	and Microsoft BASIC Professional Development System (PDS) versions
	7.00 and 7.10 for MS-DOS. The SetUEvent routine and the ON UEVENT
	statement are not found in QuickBASIC version 4.00 or earlier.
	
	For more information on the CALL INTERRUPT statement used in the code
	example below to call the Microsoft Mouse, query on the following
	words in this database:
	
	   mouse and CALL and INTERRUPT
	
	INTERRUPT is an external routine located in QB.LIB on the QuickBASIC
	release disk.
	
	Code Example
	------------
	
	DECLARE SUB mouse (m0, m1, m2, m3)
	' change following line to include QBX.BI if in BASIC PDS 7.00/7.10
	REM $INCLUDE: 'QB.BI'
	
	ON UEVENT GOSUB handler
	UEVENT ON
	
	m0 = 0: CALL mouse(m0, m1, m2, m3)                 'Initialize the MOUSE
	   IF NOT m0 THEN CALL SetUEvent    'If no Mouse installed print message
	'-------------- Other program code can be written here -----------------
	END
	handler:
	   PRINT "No Mouse installed"
	END
	
	SUB mouse (m0, m1, m2, m3) STATIC         'Talks to the MOUSE.COM driver
	DIM inregs AS RegType: DIM outregs AS RegType
	   inregs.ax = m0                                    'Load the registers
	   inregs.bx = m1
	   inregs.cx = m2
	   inregs.dx = m3
	   CALL INTERRUPT(51, inregs, outregs)   'Call the mouse driver interrupt
	   m0 = outregs.ax
	   m1 = outregs.bx                             'Return values from driver
	   m2 = outregs.cx
	   m3 = outregs.dx
	END SUB
