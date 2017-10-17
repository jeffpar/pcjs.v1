---
layout: page
title: "Q39342: How to Solve Common QuickBASIC Communications Port Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q39342/
---

## Q39342: How to Solve Common QuickBASIC Communications Port Problems

	Article: Q39342
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 9-AUG-1990
	
	This article outlines troubleshooting advice for using serial
	communications in QuickBASIC versions 4.00, 4.00b, and 4.50, in
	Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2, and in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10.
	
	This article gives a sample OPEN COM statement that should work
	correctly. Additional communications troubleshooting hints are also
	given. For a related article, query in this Knowledge Base on the
	following words:
	
	   "COM1:" and "COM2:" and error and message and explanations
	
	If you have problems using "COM1:" or "COM2:", try the following OPEN
	statement, which makes BASIC as tolerant as possible of
	hardware-related problems:
	
	   OPEN "COM1:300,N,8,1,BIN,CD0,CS0,DS0,OP0,RS,TB2048,RB2048" AS #1
	
	(This OPEN is FOR RANDOM access.) The following is an explanation of
	each recommended parameter used in this OPEN statement:
	
	1. The higher the baud rate, the greater the chances for problems;
	   thus, 300 baud is unlikely to give you problems. 2400 baud is
	   the highest speed possible over most telephone lines, due to
	   their limited high-frequency capability. 19,200 baud, which
	   requires a direct wire connection, is most likely to cause
	   problems. (Possible baud rates for QuickBASIC are 75, 110, 150,
	   300, 600, 1200, 1800, 2400, 4800, 9600, and 19,200.)
	
	2. Parity usually does not help you significantly; because of this,
	   you should try No parity (N).
	
	   For those devices that require parity, you should use the PE option
	   (Parity Enable) in the OPEN COM statement, which is required to
	   turn on parity checking. When the PE option turns on parity
	   checking, a "Device I/O error" occurs if the two communicating
	   programs have two different parities. (Parity can be Even, Odd,
	   None, Space, or Mark). For example, a "Device I/O error" occurs
	   when two programs try to talk to each other across a serial line
	   using the following two different OPEN COM statements:
	
	      OPEN "COM1:1200,O,7,2,PE" FOR RANDOM AS #1
	
	   and
	
	      OPEN "COM2:1200,E,7,2,PE" FOR RANDOM AS #2
	
	   If the PE option is removed from the OPEN COM statements above, no
	   error message displays.
	
	3. The above example uses 8 data bits and 1 stop bit. Eight data bits
	   requires No parity (N), because of the size limit for BASIC's
	   communications data frame (10 bits).
	
	4. The BIN (binary mode) is the default. Note: The ASC option does NOT
	   support XON/XOFF protocol, and the XON and XOFF characters are
	   passed without special handling.
	
	5. Ignoring hardware handshaking often corrects many problems. Thus,
	   if your application does not require handshaking, you should try
	   turning off the following hardware line-checking:
	
	      CD0 = Turns off time-out for Data Carrier Detect (DCD) line
	      CS0 = Turns off time-out for Clear To Send (CTS) line
	      DS0 = Turns off time-out for Data Set Ready (DSR) line
	      OP0 = Turns off time-out for a successful OPEN
	
	6. RS suppresses detection of Request To Send (RTS).
	
	7. For buffer-related problems, try increasing the transmit and
	   receive buffer sizes above the 512-byte default:
	
	      TB2048 = Increases the transmit buffer size to 2048 bytes
	      RB2048 = Increases the receive buffer size to 2048 bytes
	
	   A larger receive buffer can help you work around BASIC delays
	   caused by statements like PAINT, which use the processor
	   intensively.
	
	The following are additional important hints for troubleshooting
	communications problems:
	
	1. You should use the INPUT$(x) function in conjunction with the
	   LOC(n) function to receive all input from the communications
	   device (where "x" is the number of characters returned by LOC(n),
	   which is the number of characters in the input queue waiting to be
	   read. "n" is the file number that you OPENed for "COM1:" or
	   "COM2:").
	
	   Avoid using the INPUT#n statement to input from the communications
	   port because INPUT#n waits for a carriage return (ASCII 13)
	   character.
	
	   Avoid using the GET#n statement for communications because GET#n
	   waits for the buffer to fill (and buffer overrun could then occur).
	
	   Also, avoid using the PUT#n statement for communications, and use
	   the PRINT#n statement instead. For example, in QuickBASIC 4.00b and
	   4.50, in BASIC Compiler 6.00 and 6.00b, and in BASIC PDS 7.00 and
	   7.10, using the PUT#n,,x$ syntax for sending a variable-length
	   string variable as the third argument of the PUT#n statement sends
	   an extra 2 bytes containing the string length before the actual
	   string. These 2 length bytes sent to the communications port may
	   confuse your receiving program if it is not designed to handle
	   them. No length bytes are sent with PUT#n,,x$ in QuickBASIC 4.00.
	   (QuickBASIC versions earlier than 4.00 don't offer the feature to
	   use a variable as the third argument of the PUT#n statement.)
	
	2. For an example of data communications, please refer to the
	   TERMINAL.BAS sample program that comes on the release disk for
	   QuickBASIC versions 4.00, 4.00b, and 4.50, for Microsoft BASIC
	   Compiler versions 6.00 and 6.00b, and for Microsoft BASIC
	   Professional Development System (PDS) versions 7.00 and 7.10.
	   Many communications problems may actually be due to inappropriate
	   source code design and flow of control.
	
	3. Many communications problems can only be shown on certain hardware
	   configurations and are difficult to resolve or duplicate on other
	   computers. We recommend experimenting with a direct connection
	   (with a short null-modem cable) instead of with a phone/modem link
	   between sender and receiver to isolate problems on a given
	   configuration.
	
	4. The wiring schemes for cables vary widely. Check the pin wiring on
	   your cable. For direct cable connections, a long or high-resistance
	   cable is more likely to give problems than a short, low-resistance
	   cable.
	
	5. If both "COM1:" and "COM2:" are open, "COM2:" will be serviced
	   first. At high baud rates, "COM1:" can lose characters when
	   competing for processor time with "COM2:".
	
	6. Using the ON COM GOSUB statement instead of polling the LOC(n)
	   function to detect communications input can sometimes work around
	   timing or buffering problems caused by delays in BASIC. Delays in
	   BASIC can be caused by string-space garbage collection, PAINT
	   statements, or other operations that heavily use the processor.
	
	Many commercial communications programs use sophisticated techniques
	not found in Microsoft BASIC and may give better performance.
	
	If you need better communications performance than you are getting
	through BASIC, you may want to try Microsoft C. (You can call
	Microsoft C routines from Microsoft QuickBASIC 4.00, 4.00b, and 4.50,
	from Microsoft BASIC Compiler 6.00 and 6.00b, and from Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10.) The
	following is an excellent reference:
	
	   "C Programmer's Guide to Serial Communications"
	   by Joe Campbell, published by Howard W. Sams & Company.
	
	QuickBASIC 3.00, 4.00, 4.00b, and 4.50 implement communications by
	direct interrupts to the IRQ3 and IRQ4 input lines on the 8259
	controller chip (instead of invoking BIOS interrupts).
	
	The following book gives an excellent technical, hardware-level
	description of serial communications for the IBM PC:
	
	   "8088 Assembler Language Programming: The IBM PC" Second Edition by
	   Willen & Krantz, published by Howard W. Sams & Co. (1983, 1984).
	   Pages 92-93, and Chapter 7 (Pages 166 to 188).
