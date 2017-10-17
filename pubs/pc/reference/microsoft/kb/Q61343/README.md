---
layout: page
title: "Q61343: ON ERROR GOTO 0 in BASIC PDS Won't Give Error Line's Address"
permalink: /pubs/pc/reference/microsoft/kb/Q61343/
---

## Q61343: ON ERROR GOTO 0 in BASIC PDS Won't Give Error Line's Address

	Article: Q61343
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900415-2
	Last Modified: 15-JAN-1991
	
	Because of new flexibility added to the ON ERROR GOTO handling in
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10, the address given when an .EXE program aborts from within an
	error handler may not be the actual address of the line that produced
	the error.
	
	If error trapping is turned on, an error occurs, and an ON ERROR GOTO
	0 or ERROR ERR statement is used in the error handler to abort the
	program, then the address of the ON ERROR GOTO 0 or ERROR ERR line
	displays when the program stops. This behavior differs from .EXE
	programs compiled in previous versions of BASIC (including QuickBASIC
	4.x and BASIC compiler 6.00 and 6.00b), which return the address of
	the line that originally caused the error.
	
	This information applies to .EXE programs compiled in Microsoft BASIC
	PDS versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Because BASIC PDS versions 7.00 and 7.10 allow errors generated in a
	module's error handler to be trapped in another module's error
	handler, the compiler must generate the address of the ON ERROR GOTO
	0 (or ERROR ERR) line. Otherwise, if the error were transferred to
	another error handler that did a RESUME NEXT, the program would not
	resume to the error handler, but to the user code (because that is the
	address the compiler would have passed to it). This leaves the error
	handler still on the stack. If this occurred multiple times, the
	program would eventually run out of stack space.
	
	Note that the QB.EXE interpreter environment found in QuickBASIC 4.x
	and BASIC compiler 6.00/6.00b treats an ON ERROR GOTO 0 in an error
	handler as if it were an ERROR ERR, causing QB.EXE to stop the program
	and flag the error on the ON ERROR GOTO 0 line. However, the BC.EXE
	compiler in these products goes to the extra work of making .EXE
	programs that report the error back where the error originally
	occurred.
	
	The following program, ERR.BAS, when compiled using BC.EXE from BASIC
	PDS version 7.00 or 7.10, will abort with an error and display the
	address of the ON ERROR GOTO 0 line. Compile and LINK as follows:
	
	   BC /x ERR.BAS,,ERR.LST;
	   LINK ERR ;
	
	The following is ERR.BAS:
	
	   ON ERROR GOTO handler
	   y = 0
	   x = 1/y
	   END
	
	   handler:
	      ON ERROR GOTO 0
	      RESUME
	
	In BASIC PDS version 7.00 or 7.10, when the program aborts, the
	following error message is given (note: the address given will be
	different on different machines):
	
	   Division by zero in line 0 of module ERR      at address 23E5:0066
	
	Looking at the following listing file (ERR.LST) produced by the
	compiler shows that the address given when the program stops in error
	is that of the ON ERROR GOTO 0 line:
	
	   0030   0006
	   0030   0006            ON ERROR GOTO handler
	   003A   0006            y = 0
	   0046   000A            x = 1/y
	   0057   000E            end
	   005C   000E            handler:
	   005C   000E               ON ERROR GOTO 0
	   0066   000E               RESUME
	   006B   000E
	   008E   000E
	
	The address given (0066) shows as the RESUME statement. This is
	because the error occurs at the end of the ON ERROR GOTO 0 statement,
	which is the starting address of the RESUME statement line. In .EXE
	programs compiled in versions of BASIC earlier than 7.00, the address
	given was of the actual line that the error occurred on (the line at
	address 0046: x = 1/y).
	
	The address given in a program without ON ERROR trapping active is
	still the address of the actual error line, x = 1/y, in BASIC 7.00 and
	7.10 (and earlier versions of BC.EXE).
