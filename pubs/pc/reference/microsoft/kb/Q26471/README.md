---
layout: page
title: "Q26471: Workarounds for CLOSE of COM(n) Disconnecting Phone Connection"
permalink: /pubs/pc/reference/microsoft/kb/Q26471/
---

## Q26471: Workarounds for CLOSE of COM(n) Disconnecting Phone Connection

	Article: Q26471
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-APR-1990
	
	QuickBASIC disconnects the phone connection when a program CLOSEs the
	communications port or when the program ENDs. This happens because the
	DTR line is dropped on a CLOSE or END statement. Below are several
	possible workarounds that might help you to overcome this design
	limitation of Microsoft QuickBASIC.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS.
	
	The first workaround is to attempt to reset the DTR line immediately
	after the CLOSE statement. To do this, the correct OUT instruction is
	sent to the modem control register to set DTR (pin 20) high. Consider
	the following example:
	
	     OPEN "COM(n): <parameters>" FOR <mode> AS #n
	     ' The rest of your program code goes here.
	     CLOSE #n
	     OUT &H3FC,3
	     END
	
	However, this example may not work because there is a small period of
	time between the CLOSE and the OUT statements. The modem may
	disconnect the phone connection even in this small time period.
	
	Some "smart" modems allow you to adjust the time-out period for the
	DTR line. If you set this time-out period higher, the modem will wait
	longer before disconnecting the phone connection. This gives you just
	enough time to execute the OUT instruction to set the DTR line higher.
	The following is an example:
	
	     OPEN "COM(n): <parameters>" FOR <mode> AS #n
	     PRINT #n, <control string>
	     ' The rest of your program code goes here.
	     CLOSE #n
	     OUT &H3FC,3
	     END
	
	In the above example, <control string> is a series of control codes
	sent to the modem to set the DTR time-out period higher. Consult the
	manual for your modem to determine the correct control code string.
	The following is an example of the above code modified to work with a
	Hayes Smartmodem:
	
	     OPEN "COM(n): <parameters>" FOR OUTPUT AS #1
	     PRINT #n, "AT S25=100" 'Sets the DTR time out to 100/100 seconds
	     ' or 1 second. Note that a carriage return is sent after this
	     ' PRINT statement. If you OPEN for BINARY, you have to send a
	     ' CHR$(13) also, which tells the modem you are at the end of the
	     ' initial control string.
	     CLOSE #1
	     OUT &H3FC,3
	     END
	
	In some cases, a complaint about losing DTR may really be about losing
	RTS. If this is the case, some modems allow you to ignore RTS, as
	follows:
	
	     OPEN "COM(n): <parameters>" FOR <mode> AS #n
	     PRINT #n, <control string>
	     ' The rest of your program code goes here.
	     CLOSE #n
	     END
	
	In this case, you would send a control string to the smart modem to
	tell it to ignore the RTS line.
	
	Note: If you do not have a smart modem and the first workaround does
	not correct the problem for you, it will be very difficult to work
	around this limitation of QuickBASIC. The best method is obtain a
	smart modem and attempt the second or third workarounds.
	
	The above examples use software instructions to set the DTR time-out
	period or to ignore the RTS line. However, some modems also allow
	these adjustments to be made with DIP switches.
	
	Notes on CHAINing and RUNning
	-----------------------------
	
	Whenever you compile standalone programs (/O), the CLOSE is performed
	implicitly when you do a RUN or a CHAIN. If your programs use
	BRUNxxx.EXE and the COM port is not CLOSEd, DTR and RTS should stay
	high. Compiling with BCOMxxx.LIB or closing the COM port always drops
	DTR.
