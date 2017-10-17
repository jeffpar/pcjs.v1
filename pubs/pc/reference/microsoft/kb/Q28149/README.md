---
layout: page
title: "Q28149: &quot;Device I/O Error&quot; Error 57 with OPEN COM1:; Use ON ERROR GOTO"
permalink: /pubs/pc/reference/microsoft/kb/Q28149/
---

## Q28149: &quot;Device I/O Error&quot; Error 57 with OPEN COM1:; Use ON ERROR GOTO

	Article: Q28149
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom TAR55904 TAR61057
	Last Modified: 4-AUG-1989
	
	When using the COM1: or COM2: serial communications port, a "Device
	I/O Error" (Error 57) normally occurs due to parity, framing, or data
	overrun problems.
	
	Sometimes, the "Device I/O Error" occurs in compiled QuickBASIC
	programs more often than in the Microsoft GW-BASIC Version 3.20 or
	other BASIC interpreters, especially when the programs are compiled
	with any of the event-trapping options (/V or /W).
	
	To alleviate this problem, trap the error 57 in an ON ERROR GOTO
	error-handler routine and RESUME execution of your program.
	
	This information applies to QuickBASIC Versions 2.00, 2.01, 3.00,
	4.00, 4.00b, and 4.50 and to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2.
	
	The following should be checked when you get communication errors:
	
	1. Because a "Device I/O Error" normally occurs due to parity,
	   framing, or data overrun problems, the following items must be
	   checked:
	
	   a. The communications cable should be checked for bad connections.
	
	   b. The communications parameters specified in the OPEN "COM"
	      statement must match the device and software on the other end of
	      the communication line.
	
	2. If the signal time per bit differs between transmitter and
	   receiver, such as when the processor clocks are slightly off, you
	   can get a "framing error." Run tests on more than one computer
	   system to see if the problem is a framing error specific to a given
	   system.
	
	3. A "Device I/O Error" is also sometimes generated when there is
	   information received prior to OPENing the file. The only control
	   that you have is to trap the error with ON ERROR GOTO and then
	   RESUME or RESUME NEXT.
	
	4. If a given program works successfully under the GW-BASIC or IBM
	   BASICA Interpreter, but not under QuickBASIC (compiled as .EXE or
	   in QB.EXE editor), the problem may be due to parity or framing
	   differences between the products.
	
	In the following code example, to simulate a full duplex-modem
	transmission, press CTRL+A and CTRL+B to send a 128-byte packet
	consisting of all 128 extended ASCII codes. If the people on each
	computer simultaneously press CTRL+A or CTRL+B, 128-byte packets are
	sent and verified on each end.
	
	You need a null modem cable consisting of at least the following line
	connections:
	
	   2 - 3
	   3 - 2
	   7 - 7
	
	Code Example
	------------
	
	OPEN "com1:9600,n,8,,cs0,ds0,cd0,BIN,rb16000" FOR RANDOM AS #1
	ON ERROR GOTO etrap
	CLS
	GOSUB helpme
	
	myconst$ = ""
	FOR n = 128 TO 255      'set up a standard packet to send and receive
	  myconst$ = myconst$ + CHR$(n)
	NEXT
	
	capture = 0   'don't capture any data
	buff$ = ""    'set up buffer
	dummyvar = FRE("")
	
	top:
	IF LOC(1) > 0 THEN
	  i$ = INPUT$(1, #1)
	  PRINT i$;
	  IF i$ = CHR$(128) THEN capture = 1       'turn it on
	  IF capture = 1 THEN buff$ = buff$ + i$
	  IF i$ = CHR$(255) THEN
	    capture = 0                            'turn it off
	    GOSUB checkit
	  END IF
	END IF
	
	o$ = INKEY$
	IF o$ <> "" THEN
	  IF o$ = CHR$(1) THEN 'CTRL+A will send chars one at a time
	    PRINT #1, ""
	    FOR n = 128 TO 255
	      PRINT #1, CHR$(n);
	    NEXT
	  ELSEIF o$ = CHR$(2) THEN 'CTRL+B will send chars all at one
	    PRINT #1, ""
	    PRINT #1, myconst$;
	  ELSEIF o$ = CHR$(3) THEN
	    END
	  ELSEIF o$ = CHR$(4) THEN
	    PRINT : PRINT "Performing garbage collection on String Heap...";
	    dummyvar = FRE("")
	    PRINT "Done": PRINT
	  ELSEIF o$ = CHR$(27) THEN
	    GOSUB helpme
	  ELSE
	    PRINT #1, o$;
	    PRINT o$; 'local echo
	  END IF
	END IF
	
	GOTO top
	
	etrap:
	  PRINT "The error number is err #"; ERR
	RESUME
	
	checkit:
	  IF myconst$ = buff$ THEN
	    PRINT "Packet Sent OK"
	  ELSE
	    PRINT "Error in Sending Packet"
	  END IF
	  buff$ = ""
	RETURN
	
	helpme:
	  PRINT
	  PRINT "CTRL+A - Send a 128-byte Extended Ascii Packet one Byte at a time"
	  PRINT "CTRL+B - Send a 128-byte Extended Ascii Packet all at once"
	  PRINT "CTRL+C - End Program"
	  PRINT "CTRL+D - Perform Garbage Collection on the String Heap"
	  PRINT "ESC - Display this Help Message"
	  PRINT
	RETURN
