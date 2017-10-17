---
layout: page
title: "Q59431: 7.10 Correction for OPEN COM Transfer &amp; Receive Buffer; TB, RB"
permalink: /pubs/pc/reference/microsoft/kb/Q59431/
---

## Q59431: 7.10 Correction for OPEN COM Transfer &amp; Receive Buffer; TB, RB

	Article: Q59431
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900217-4 docerr
	Last Modified: 16-JAN-1991
	
	This article corrects three documentation errors in the description
	of the Transfer Buffer (TB[n]) and Receive Buffer (RB[n]) options for
	the OPEN COM statement on page 240 of the "Microsoft BASIC 7.0:
	Language Reference" manual for BASIC PDS versions 7.00 and 7.10.
	
	Also, page 559 of "Microsoft BASIC 7.0: Programmer's Guide"
	incorrectly states that "the transmission buffer is allocated 128
	bytes for each communications port." This should be changed to "512
	bytes" for the default transmission buffer size.
	
	To illustrate the documentation corrections (listed below), consider
	the following program sequence. PROG1.EXE is started from the DOS or
	OS/2 command line. PROG1 sets the receive-buffer size to 4096 in the
	OPEN COM statement, CLOSEs the communications port, and CHAINS to
	PROG2.EXE. When PROG2 OPENs the COM port, if PROG2 does not use the RB
	parameter, the size of the receive buffer will still be 4096. This is
	true whether you compile with /O or use the BRTxxx.EXE run-time
	module.
	
	Note that the size of the transmit buffer (TB) in PROG1.EXE never
	affects the size of the transmit buffer in PROG2.EXE. The size of the
	transmit-buffer is not transferred across a CHAIN. (This is by
	design.)
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The following are three documentation errors in the description of the
	Transfer Buffer (TB[n]) and Receive Buffer (RB[n]) options for the
	OPEN COM statement on page 240 of the "Microsoft BASIC 7.0: Language
	Reference" manual:
	
	1. For the TB[n] option, the first sentence is incorrect, as follows:
	
	      Sets the size of the receive buffer to n bytes.
	
	   This sentence should be changed to read as follows:
	
	      Sets the size of the transmit buffer to n bytes.
	
	2. For the TB[n] option, the last sentence incorrectly describes the
	   default transmit buffer size, as follows:
	
	      The default value, if n or the TB option is omitted, is the
	      current receive buffer size.
	
	   This sentence should be changed to read as follows:
	
	      The default value, if n or the TB option is omitted, is 512
	      bytes.
	
	   (Note: The default size for the transmit buffer is 512 bytes; the
	   only way to change this size is with the TB option in the OPEN COM
	   statement. The transmit-buffer size is never affected by any
	   receive-buffer options.)
	
	3. The description for the RB[n] option should be supplemented to say
	   that the receive buffer size of the program currently being
	   executed, if not changed by the RB in the OPEN COM statement or by
	   the /C:n option on the QB or BC command line, will be the same as
	   for the program from which the current program was CHAINed (if any)
	   with the CHAIN statement.
	
	The OPEN COM statement can open the device names "COM1:" and "COM2:".
