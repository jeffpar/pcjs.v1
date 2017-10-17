---
layout: page
title: "Q43746: QuickBASIC Program to Send a Break through COM1 Port"
permalink: /pubs/pc/reference/microsoft/kb/Q43746/
---

## Q43746: QuickBASIC Program to Send a Break through COM1 Port

	Article: Q43746
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890418-97 B_BasicCom
	Last Modified: 14-DEC-1989
	
	Below is a Microsoft QuickBASIC program that sends a Break through
	COM1 using the OUT statement. To cause a Break condition to be output
	on the communications line, the Line-Control Register must be read in,
	the Break bit set (bit number 6), and the register rewritten to the
	port. The Line-Control Register is an 8250 register at I/O port
	address 3FB hex. More information concerning the Line-Control Register
	and other 8250 registers can be found on Pages 177-181 in "8088
	Assembler Language Programming: The IBM PC," 2nd edition, by David C.
	Willen and Jeffrey I. Krantz (published by SAMS, 1988).
	
	A simple outline of the program below is as follows:
	
	1. Get current Line-Control Register -- value% = INP(&H3FB)
	
	2. Set the Break bit, bit 6, 2^6= 64 -- value% = value% OR 64
	
	3. Rewrite Line-Control Register     -- OUT &H3FB, value%
	
	The following program executes correctly in Microsoft QuickBASIC
	Compiler Versions 4.00, 4.00b, and 4.50, Microsoft BASIC Compiler
	Versions 6.00 and 6.00b, and Microsoft BASIC PDS Version 7.00:
	
	'--------------------------------------------------------------------
	' SETBREAK.BAS:
	'
	' This is a sample QuickBASIC program that reads the Line-Control
	' Register for the communications port (address &H3FB), sets the
	' Break, and puts it back to the port. This causes a Break to be sent
	' through the communications port.
	'
	'--------------------------------------------------------------------
	
	DECLARE SUB IntToBin (byte%, bin$)
	DECLARE SUB BreakWord (dataword%, highbyte%, lowbyte%)
	CLS
	
	OPEN "com1:9600,n,8,,CS0,DS0,CD0,RB8192,TB8192" FOR RANDOM AS 1
	
	LineContlReg1% = INP(&H3FB)                        'Get line control
	                                                   'register
	
	CALL BreakWord(LineContlReg1%, high1%, low1%)
	CALL IntToBin(LineContlReg1%, LCR1$)
	PRINT "---BEFORE SETTING BREAK---"
	PRINT "Line-Control Register (LCR) :  "; LineContlReg1%
	PRINT "LCR representation in binary:  "; LCR1$
	PRINT
	
	LineContlReg2% = LineContlReg1% OR 64              'Set Break -- 6th
	                                                   'bit
	
	CALL BreakWord(LineContlReg2%, high2%, low2%)
	CALL IntToBin(LineContlReg2%, LCR2$)
	PRINT "---AFTER SETTING BREAK---"
	PRINT "Line-Control Register (LCR) :  "; LineContlReg2%
	PRINT "LCR representation in binary:  "; LCR2$
	
	OUT &H3FB, LineContlReg2%    'Reset the Line-Control Register to send
	                             'a Break
	
	END
	
	'____________________________________________________________________
	'
	'     BreakWord() takes an integer argument and returns two integers
	'     representing the high and low bytes of the original.
	'____________________________________________________________________
	'
	SUB BreakWord (dataword%, highbyte%, lowbyte%)
	    IF dataword% < 0 THEN
	       highbyte% = (dataword% + 2 ^ 16) \ 256   'check for high BIT
	                                                'set
	    ELSE
	       highbyte% = dataword% \ 256              'integer divide off
	                                                'low byte
	    END IF
	
	    lowbyte% = dataword% AND 255                'AND off the top byte
	END SUB
	
	'____________________________________________________________________
	'
	'    IntToBin() takes an INTEGER argument and produces a
	'    binary string representation of the INTEGER.
	'____________________________________________________________________
	'
	SUB IntToBin (byte%, bin$)
	bin$ = ""
	temp% = byte%
	
	FOR i = 0 TO 7
	    IF temp% AND 1 THEN
	       bin$ = "1" + bin$
	    ELSE
	       bin$ = "0" + bin$
	    END IF
	    temp% = temp% \ 2
	NEXT
	
	END SUB
