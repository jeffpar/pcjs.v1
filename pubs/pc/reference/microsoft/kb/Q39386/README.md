---
layout: page
title: "Q39386: Error Message Explanations When Using &quot;COM1:&quot; and &quot;COM2:&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q39386/
---

## Q39386: Error Message Explanations When Using &quot;COM1:&quot; and &quot;COM2:&quot;

	Article: Q39386
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 10-AUG-1990
	
	The following error messages can appear when using the "COM1:" or
	"COM2:" device:
	
	   Error Message                     Number
	   -------------                     ------
	
	   File Already OPEN                 (Error 55)
	   Bad File Name or Number           (Error 52)
	   Out of Memory                     (Error 7)
	   Device Unavailable                (Error 68)
	   Device I/O Error                  (Error 57)
	   Communications Buffer Overflow    (Error 69)
	   Device Timeout                    (Error 24)
	
	This article gives the logic used to determine when to display these
	errors during OPEN, INPUT, OUTPUT, and other statements when using the
	"COM1:" or "COM2:" device. This information applies to Microsoft
	QuickBASIC versions 4.00, 4.00b, and 4.50 and to Microsoft BASIC
	Compiler versions 6.00 and 6.00b for MS-DOS and MS OS/2. For a related
	article concerning how to solve common communications port problems,
	search for the following words in this Knowledge Base:
	
	   solve and "com1:" and port and problems
	
	The OPEN "COM1:" or OPEN "COM2:" statement uses the following logic,
	in order of execution, to check for errors:
	
	1. Check if <device number> was OPEN previously in the program. "File
	   Already OPEN" displays if <file number> is already open.
	
	2. Parse the options used in the OPEN "COM1:" or OPEN "COM2:"
	   statement. "Bad File Name or Number" displays if any of the
	   following are true:
	
	   a. Baud rate is not numeric or over 65,535
	
	   b. Parity is not N, O, E, M, or S
	
	   c. Data bits are not 5, 6, 7, 8
	
	   d. Data bits are 8 and parity is O, E, M, or S
	
	   e. Stop bits are not 1 or 2 (1.5 is not supported)
	
	   f. One of the following arguments is misspelled (order is not
	      significant for these; "m" can be null or a number from 0 to
	      65,535 milliseconds; buffersize "x" can be up to 32,767 bytes):
	
	            OPm, DSm, CSm, CDm, RBx, TBx, RS, LF, BIN, ASC
	
	3. Allocate transmit and receive buffers. "Out of Memory" displays if
	   no room is left for buffers in the default data segment.
	
	4. Initialize device interface.
	
	   a. "Bad File Name" displays when using anything other than "COM1:"
	      or "COM2:" or when using a baud rate not equal to 75, 110, 150,
	      300, 600, 1200, 1800, 2400, 4800, 9600, or 19,200.
	
	   b. "Device Unavailable" displays if the communications interface is
	      already in use or does not exist (according to the 4 bytes at
	      400 hex in low PC memory).
	
	      If no errors have occurred at this point in the OPEN, the baud
	      rate, data size, parity, and stop bits are now set. DTR is set.
	      RTS is set if the RS option is not specified. If you use the OPn
	      (OPEN time-out) option, Item 4c (below) applies.
	
	   c. "Device I/O Error" displays if an OPn OPEN time-out occurs after
	      waiting for DSR (Data Set Ready) or DCD (Data Carrier Detect).
	
	      (Note: QuickBASIC versions 2.00, 2.01, and 3.00 use the DSn and
	      CDn options for DSR and DCD time-out instead of the later
	      versions 4.00, 4.00b, and 4.50 OPn option.)
	
	Compiled BASIC uses the following logic during INPUT from "COM1:" or
	"COM2:":
	
	1. Check for errors.
	
	   a. "Communications Buffer Overflow" displays for receive (or
	      transmit) buffer overflow.
	
	   b. "Device I/O Error" displays for any of the following conditions:
	
	         Condition       Description
	         ---------       -----------
	
	         break           A special line condition where line voltage
	                         is held "on" (sending 1 bit, which is
	                         between -25 and -3 volts) over more than 10
	                         bit-times. (Note that "off" means a 0 bit,
	                         which is between +3 and +25 volts).
	
	         parity error    Can occur if line is noisy, or the wrong baud
	                         or parity is being used.
	
	         overrun error   The character (a 10-bit data frame) was not
	                         read from the interface hardware in time
	                         before it was overwritten by the next
	                         received character.
	
	         framing error   The bit to be interpreted as the stop bit was
	                         not 0. A framing error can occur if the line
	                         is noisy, if the wrong baud rate is used, or
	                         if the clock speeds on the communicating PCs
	                         are mismatched.
	
	   c. "Device Timeout Error" displays if a CTS, DSR, or DCD time-out
	      occurs.
	
	2. If no errors occurred, get next character from receive buffer. If
	   none, then loop.
	
	Compiled BASIC uses the following logic during OUTPUT to "COM1:" or
	"COM2:":
	
	1. Check for errors. (Same as for INPUT above.)
	
	2. Test if transmit buffer is full. If full, loop back to 1.
	
	3. Put character into buffer.
	
	The LOC(n) function does the following when used with "COM1:" or
	"COM2:":
	
	1. Check for errors. (Same as for INPUT above.)
	
	2. LOC(n) returns the number of characters currently in the receive
	   buffer.
	
	The LOF(n) function does the following when used with "COM1:" or
	"COM2:":
	
	1. Check for errors. (Same as for INPUT above.)
	
	2. LOF(n) returns the room left in the TRANSMIT buffer in QuickBASIC
	   versions 4.00, 4.00b, and 4.50 and Microsoft BASIC Compiler
	   versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	   LOF(n) returns the room left in the RECEIVE buffer in QuickBASIC
	   versions 1.00, 1.02, 2.00, 2.01, and 3.00.
	
	BASIC uses the following logic when you CLOSE the "COM1:" or "COM2:"
	device:
	
	1. Transmit output. If using the ASC option (and not the BIN option),
	   transmit an end-of-file (EOF) character (CTRL+Z).
	
	2. Wait for pending output to finish or time-out.
	
	3. Restore interrupt vectors.
	
	4. Deallocate transmit and receive buffers from BASIC's default data
	   segment.
	
	5. Report any pending errors.
