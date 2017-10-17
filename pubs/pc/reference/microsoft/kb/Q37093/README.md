---
layout: page
title: "Q37093: Toggling DTR Handshaking Line (Pin 20) with OUT Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q37093/
---

## Q37093: Toggling DTR Handshaking Line (Pin 20) with OUT Statement

	Article: Q37093
	Version(s): 2.00 2.01 3.00 4.OO 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 26-FEB-1990
	
	The communications port DTR line (Pin 20) can be toggled with an OUT
	statement. The OUT statement should access the modem control register
	in the UART. The modem control register can be accessed by the
	following statements:
	
	For COM1, the statement is as follows:
	
	   OUT &H3FC, INP(&H3FC) OR 1   ' Sets low bit to turn DTR on.
	   OUT &H3FC, INP(&H3FC) AND &HFE  ' Clears low bit to turn off DTR.
	
	For COM2, the statement is as follows:
	
	    OUT &H2FC, INP(&H2FC) OR 1   ' Sets low bit to turn DTR on.
	    OUT &H2FC, INP(&H2FC) AND &HFE  ' Clears low bit to turn off DTR.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	Other information concerning hardware addresses for serial
	communications can be found in "The Programmer's PC Sourcebook" by
	Thom Hogan (Microsoft Press, 1988).
	
	Code Example
	------------
	
	'------------------------- DTR.BAS ------------------------------
	'
	'    This program shows how to toggle on and off the DTR line for
	'    the RS-232 serial communications line in compiled BASIC.
	'
	'    The DTR (Data Terminal Ready) line is controlled by the lowest
	'    bit in the modem control register, which is located at port
	'    address 3FC Hex for COM1: or 2FC Hex for COM2:.
	'
	OPEN "Com1:9600,n,8,,CS0,DS0,CD0" FOR RANDOM AS 1
	CLS
	PRINT "Press d for DTR on, OR o for DTR off"
	DO UNTIL keyinput$ = CHR$(27)
	    keyinput$ = INKEY$
	    IF (keyinput$ = "d") OR (keyinput$ = "D") THEN
	       OUT &H3FC, INP(&H3FC) OR 1   ' Sets low bit to turn DTR on.
	    ELSEIF (keyinput$ = "o") OR (keyinput$ = "O") THEN
	       OUT &H3FC, INP(&H3FC) AND &HFE  ' Clears low bit to turn off DTR.
	    END IF
	LOOP
