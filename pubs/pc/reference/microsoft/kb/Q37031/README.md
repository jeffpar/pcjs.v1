---
layout: page
title: "Q37031: Printer Error Can Hang; CALL INTERRUPT to Check Printer Status"
permalink: /pubs/pc/reference/microsoft/kb/Q37031/
---

## Q37031: Printer Error Can Hang; CALL INTERRUPT to Check Printer Status

	Article: Q37031
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881012-4545 B_BasicCom
	Last Modified: 28-DEC-1989
	
	Detecting printer errors with the ON ERROR GOTO statement is usually
	very slow. While the printer is waiting to time-out due to an error,
	the program may appear to be hung. Depending on the type of computer,
	MS-DOS or a QuickBASIC program may take from 20 seconds to more than
	two minutes before displaying a printer time-out error. This is
	expected behavior. The printer time-out period is determined by the
	BIOS of your computer.
	
	A printer time-out error is one of the most likely reasons for a
	QuickBASIC hanging problem. (If you wait more than a few minutes
	without getting an error message, then printer time-out is probably
	not the problem.)
	
	As an alternative to waiting for the printer time-out, you can check
	the status of the printer periodically throughout a program using BIOS
	Interrupt 17 Hex, function 2, as shown further below.
	
	This information applies to all versions of Microsoft QuickBASIC for
	the IBM PC and compatibles, to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	The easiest way to check for printer errors is to send output to the
	printer and trap any errors with an ON ERROR GOTO statement. This
	method is slow and not always reliable, such as in the case where you
	send out less than a full buffer to the printer. When a program sends
	out less than a full buffer to the printer, an error may go undetected
	by the program until it fills the buffer later, at which point it
	appears to hang until it times out.
	
	If you print a file from MS-DOS or a QuickBASIC program when the
	printer is off line, it will take up to a couple of minutes for an
	error to be returned. The time allowed for a response varies from
	version to version of the ROM BIOS.
	
	However, you can check the status of the printer periodically
	throughout a program by using the BIOS Interrupt 17 Hex, function 2.
	This interrupt returns the printer status in the AH register. Each bit
	returned in AH represents the following printer conditions:
	
	   Bit     Condition
	   ---     ---------
	
	   Bit 7   Printer Not Busy (0 = Busy)
	   Bit 6   Acknowledge
	   Bit 5   Out of Paper
	   Bit 4   Printer Selected
	   Bit 3   I/O Error
	   Bit 2   Unused
	   Bit 1   Unused
	   Bit 0   Timed-Out
	
	For example, to determine if the printer is out of paper, the
	interrupt could be called and bit 5 could be examined. To call DOS
	interrupts through QuickBASIC, the CALL INTERRUPT routine is used.
	This routine is discussed on Pages 89-91 of the "Microsoft QuickBASIC
	4.0: BASIC Language Reference" manual.
	
	The following is a sample BASIC program that uses CALL INTERRUPT to
	check the printer status when the F1 key is pressed or after a BASIC
	error:
	
	   DECLARE SUB PrinterStatus ()
	   DEFINT A-Z
	   REM $INCLUDE: 'qb.bi'
	   ' For BASIC PDS, include 'qbx.bi'
	   CLS
	   ON ERROR GOTO trap
	   ON KEY(1) GOSUB CheckPrinter
	   KEY(1) ON
	   OPEN "lpt1:" FOR OUTPUT AS #1
	   FOR i = 1 TO 1000
	       PRINT #1, "dflkgjsaklfajds;lfk"
	   NEXT i
	   END
	
	The following is a checkprinter program:
	
	   CALL PrinterStatus
	   INPUT "Hit Any Key to Continue"; a$
	   RETURN
	
	The following is a trap program:
	
	   PRINT "err = "; ERR
	   CALL PrinterStatus
	   INPUT "Hit Any Key to Continue"; a$
	   RESUME
	
	SUB PrinterStatus STATIC
	   DIM ina AS RegType, outa AS RegType
	   DIM INFO$(7)
	   ina.ax = &H200
	   ina.dx = &H0
	   CALL INTERRUPT(&H17, ina, outa)
	   outah = outa.ax \ 256
	   FOR i = 7 TO 0 STEP -1
	       result = (outah) AND (2 ^ i)
	       IF result = 0 THEN
	          INFO$(i) = "OFF"
	       ELSE
	          INFO$(i) = "ON"
	       END IF
	   NEXT i
	   PRINT "Bit 7 - Printer Not Busy : "; INFO$(7)
	   PRINT "Bit 6 - Acknowledge : "; INFO$(6)
	   PRINT "Bit 5 - Out of Paper : "; INFO$(5)
	   PRINT "Bit 4 - Printer Selected : "; INFO$(4)
	   PRINT "Bit 3 - I/O Error : "; INFO$(3)
	   PRINT "Bit 2 - Unused : "; INFO$(2)
	   PRINT "Bit 1 - Unused : "; INFO$(1)
	   PRINT "Bit 0 - Timed-Out : "; INFO$(0)
	END SUB
