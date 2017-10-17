---
layout: page
title: "Q65927: Using INTERRUPT 15 hex for Time Increments Less Than 1 Second"
permalink: /pubs/pc/reference/microsoft/kb/Q65927/
---

## Q65927: Using INTERRUPT 15 hex for Time Increments Less Than 1 Second

	Article: Q65927
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900907-9 B_BasicCom
	Last Modified: 18-OCT-1990
	
	The resolution of the ON TIMER (n) GOSUB statement is limited to
	increments of 1 second.
	
	The following are three separate methods to work around this
	limitation (to obtain a smaller time interval):
	
	1. Use BIOS INTERRUPT 15 hex, with function 86 hex (or, in decimal,
	   INTERRUPT 21 with function 134) for resolution at intervals of 976
	   microseconds (976 millionths, or .000976 of a second).
	
	2. Use BIOS INTERRUPT 1A hex (26 decimal) with function 0 for a
	   resolution at about 18.20648 ticks per second (or .05492549
	   seconds).
	
	3. Use the ON PLAY statement for resolution at 30 times per second
	   (or .0333333).
	
	This article describes method 1 above. To find two additional
	articles, which explain methods 2 and 3, search in this Knowledge Base
	for the following exact words:
	
	   BASIC and timer and increments and smaller and second
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS.
	
	By using the INTERRUPT service routine 15 hex with function 86 hex (in
	decimal: INT 21 with function 134) you can delay the execution of the
	program for a interval of 976 microseconds. This interrupt and
	function work properly only on IBM AT and PS/2 class machines, and
	will fail on PC or XT class machines, which do not support this
	function. Method 2 or 3 above can be used if this INTERRUPT fails on
	your machine.
	
	Note that the INTERRUPT routine is only designed for MS-DOS, and is
	NOT supported under OS/2 protected mode.
	
	For more information regarding interrupts under MS-DOS, please refer
	to "Advanced MS-DOS Programming, Second Edition", by Ray Duncan,
	published by Microsoft PRESS (1988).
	
	Sample Code
	-----------
	
	'| *******************************************************************
	'|   The DELAY% function below uses an interrupt call to suspend the
	'|   execution of the program for a given number of microseconds, in
	'|   integrals of 976 microseconds.
	'|   This program uses BIOS interrupt 15 hex with function 86 hex
	'|   (or, in decimal, interrupt 21 with function 134).
	'|
	'|   NOTE : This interrupt only works on AT and PS/2 machines, and
	'|          will fail on PC or XT class machines. The function will
	'|          return a value of 1 when it fails to delay the program,
	'|          and a value of 0 when it completes the call.
	'|
	'| *******************************************************************
	
	DECLARE FUNCTION DELAY% (Integral AS LONG)
	
	'|  Use the following $INCLUDE metacommand in Microsoft QuickBASIC
	'|  4.00/4.00b/4.50 or BASIC Compiler 6.00/6.00B:
	REM $INCLUDE: 'QB.BI'
	'|  You must change 'QB.BI' to 'QBX.BI' above if you are using
	'|  BASIC PDS 7.00 or 7.10.
	
	FUNCTION DELAY% (Integral&)
	        '| Set up the register parameters used by INTERRUPT routine:
	        DIM ToDOS AS RegType, FromDOS AS RegType
	
	        '| Interrupt service 15 hex with function 86 hex will suspend
	        '| the calling process for a specified interval in microseconds.
	        DOSINT% = &H15
	        ToDOS.Ax = &H8600
	
	        '| Calculate the Microseconds to pause (Integrals of 976):
	        MicroSeconds& = Integral& * 976
	
	        '| The Delay value is a long integer and must be broken into
	        '| the component high/low integer parts:
	        ToDOS.Dx = VAL("&H" + HEX$(MicroSeconds& MOD &H10000))
	        ToDOS.Cx = VAL("&H" + HEX$(MicroSeconds& \ &H10000))
	
	        CALL INTERRUPT (DOSINT%, ToDOS, FromDOS)
	        '| This interrupt service only works on a AT or PS/2 machine
	        '| and will fail on PC/XT machines, and possible other machines.
	        IF FromDOS.Flags AND 1 THEN
	           ReturnDelay% = 1    '| Failed interrupt call
	        ELSE
	           ReturnDelay% = 0    '| Call Worked and should have delayed
	        END IF
	        '| Return the flag to the caller:
	        DELAY% = ReturnDelay%
	END FUNCTION
