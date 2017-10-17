---
layout: page
title: "Q57890: Overhead for /V and /W Event Trapping Is Reduced in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57890/
---

## Q57890: Overhead for /V and /W Event Trapping Is Reduced in BASIC 7.00

	Article: Q57890
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	The code overhead for BC /V is only 3 bytes per statement, and the
	code overhead for BC /W is only 3 bytes per labeled or numbered line,
	in Microsoft BASIC Professional Development System (PDS) Version 7.00
	for MS-DOS and MS OS/2.
	
	The overhead for these event trapping options is 5 bytes in Microsoft
	QuickBASIC Versions 4.00, 4.00b, and 4.50 for MS-DOS, and in Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2.
	
	Event trapping for the ON <event> GOSUB statements is handled by
	polling. The <event> can be COM(n), KEY(n), PEN, PLAY(), STRIG, and
	TIMER. In BASIC 6.00, 6.00b, and 7.00, you can also use ON SIGNAL and
	ON UEVENT.
	
	At various points in your code, as controlled by the /V and /W options
	and the <event> ON and <event> OFF statements, the compiler places a
	call instruction to a routine that checks for events. /V places the
	call on every statement in the module. /W only places the call on
	every numbered or labeled line in the module. In QuickBASIC Versions
	4.00, 4.00b, and 4.50 and in Microsoft BASIC Compiler 6.00 and 6.00b,
	this call occupies 5 bytes. In BASIC 7.00, this has been reduced to 3
	bytes per call.
