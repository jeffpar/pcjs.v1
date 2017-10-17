---
layout: page
title: "Q67315: How to Use CALL INTERRUPT to Diagnose COM &quot;Device I/O&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q67315/
---

## Q67315: How to Use CALL INTERRUPT to Diagnose COM &quot;Device I/O&quot; Error

	Article: Q67315
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM
	Last Modified: 5-DEC-1990
	
	This article contains a code example showing how to obtain and decode
	the information contained within the communications line-status and
	modem-control registers. The contents of the registers is found by
	calling BIOS interrupt 14 hex, with function 3. This information is
	helpful in pinpointing the cause of communications port (COM1 or
	COM2), errors such as "Device I/O" errors.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS and to Microsoft BASIC PDS (Professional
	Development System) versions 7.00 and 7.10 for MS-DOS.
	
	Calling interrupt 14 hex with function 3 hex is helpful in finding
	whether a "Device I/O" error stems from problems such as break,
	framing, or overrun problems during communications. If you are trying
	to pinpoint the underlying cause of a communications error, you should
	call the interrupt from within an ON ERROR GOTO handler in your BASIC
	program. The code sample below demonstrates how the communications
	port status can be checked when a "Device I/O" error is generated.
	
	For more information on how to overcome communications-related errors,
	query on the following words:
	
	   Device I/O and solve and common and communications and port and
	   problems
	
	Information on interrupt 14 hex with function 3 hex can be found in
	the following books:
	
	   "The New Peter Norton Programmer's Guide to the IBM PC & PS/2; the
	   Ultimate Reference Guide to the Entire Family of IBM Personal
	   Computers" by Peter Norton and Richard Wilton, published by
	   Microsoft Press (1985). See page 230.
	
	   "The Programmer's PC Sourcebook" by Thom Hogan, published by
	   Microsoft Press (1988). See page 220.
	
	To run the following sample program in the environment, the quick
	library QB.QLB (or QBX.QLB, if using BASIC PDS) must be loaded as
	follows:
	
	   QB /L QB.QLB      [The DOS command line if using QuickBASIC]
	   QBX /L QBX.QLB    [The DOS command line if using BASIC PDS]
	
	To make an .EXE file from DOS, the compiled program must be linked
	with the library QB.LIB (or QBX.LIB, if using BASIC PDS).
	
	Code Example
	------------
	
	DECLARE SUB GetPortStatus (MessageCount%)
	'$INCLUDE: 'qb.bi'   'Include this line if using QuickBASIC
	'$INCLUDE: 'qbx.bi'   'Include this line if using BASIC PDS
	DIM SHARED InRegs AS RegType, OutRegs AS RegType
	DIM SHARED StatusMessage(15) AS STRING * 35
	CLS
	ON ERROR GOTO ErrorHandler:
	ERROR 57      'This statement forces a "Device I/O" error
	
	' The following code (REMARKed out) is a sample routine that reads
	' communications port input. Remove the ERROR 57 line above and the
	' REMARKs in this section of code to run the sample when data is being
	' sent from another device to COM1. It is unlikely that the following
	' code segment will generate a "Device I/O" error. The code is merely
	' included as an indication of where the communications routine is
	' located relative to the rest of the code. It is recommended that you
	' replace the following code segment with your own communications
	' routine, especially if your code leads to "Device I/O" or other
	' communications related errors.
	
	'OPEN "COM1:300,N,8,1,BIN,CD0,CS0,DS0,OP0,RS,TB2048,RB2048" FOR _
	 RANDOM AS #1
	
	'WHILE LOC(1)=0
	'WEND
	
	'WHILE NOT EOF(1)
	'   a$ = INPUT$(LOC(1),1)
	'WEND
	
	Done:
	'CLOSE #1
	END
	
	ErrorHandler:
	   IF ERR = 57 THEN
	      CALLGetPortStatus(LastMessage%)
	      FOR i% = 0 TO LastMessage% - 1
	         PRINT StatusMessage(i%)
	      NEXT i%
	   END IF
	   RESUME Done:
	
	REM $STATIC
	SUB GetPortStatus (MessageCount%)
	   MessageCount% = 0
	   InRegs.AX = &H300   ' Load the service number 3 hex in the
	                       ' high byte of AX
	            ' Call BIOS interrupt 14 hex
	   CALL Interrupt(&H14, InRegs, OutRegs)
	
	   ' Decode the upper 8 bits of AX containing line-status
	   ' register information:
	
	   IF OutRegs.AX AND 2 ^ 8 THEN
	      StatusMessage(MessageCount%) = "Data ready"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 9 THEN
	      StatusMessage(MessageCount%) = "Overrun error"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 10 THEN
	      StatusMessage(MessageCount%) = "Parity error"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 11 THEN
	      StatusMessage(MessageCount%) = "Framing error"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 12 THEN
	      StatusMessage(MessageCount%) = "Break-detect error"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 13 THEN
	      StatusMessage(MessageCount%) = _
	         "Transfer holding register empty"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 14 THEN
	      StatusMessage(MessageCount%) = "Transfer shift register empty"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 15 THEN
	      StatusMessage(MessageCount%) = "Time-out error"
	      MessageCount% = MessageCount% + 1
	   END IF
	
	   ' Decode the lower 8 bits of the AX register containing
	   ' modem-status information:
	
	   IF OutRegs.AX AND 2 ^ 0 THEN
	      StatusMessage(MessageCount%) = "Delta clear-to-send"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 1 THEN
	      StatusMessage(MessageCount%) = "Delta data-set-ready"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 2 THEN
	      StatusMessage(MessageCount%) = "Trailing-edge ring detector"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 3 THEN
	      StatusMessage(MessageCount%) = _
	         "Delta receive line signal detect"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 4 THEN
	      StatusMessage(MessageCount%) = "Clear-to-send"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 5 THEN
	      StatusMessage(MessageCount%) = "Data-set-ready"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 6 THEN
	      StatusMessage(MessageCount%) = "Ring indicator"
	      MessageCount% = MessageCount% + 1
	   END IF
	   IF OutRegs.AX AND 2 ^ 7 THEN
	      StatusMessage(MessageCount%) = "Received line signal detect"
	      MessageCount% = MessageCount% + 1
	   END IF
	END SUB
