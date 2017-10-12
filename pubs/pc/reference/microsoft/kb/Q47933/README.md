---
layout: page
title: "Q47933: Effective Limit of 52 Threads Per Process with DosCreateThread"
permalink: /pubs/pc/reference/microsoft/kb/Q47933/
---

	Article: Q47933
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | docerr OpSys PMWin
	Last Modified: 16-JAN-1990
	
	A single process running under OS/2 Version 1.10 or 1.00 is limited to
	creating 52 threads with DosCreateThread.
	
	Attempting to create additional threads results in a return value
	from DosCreateThread of 155, which is defined as ERROR_TOO_MANY_TCBS
	(Thread Control BlockS) in BSEERR.H.
	
	The "Microsoft OS/2 Programmer's Reference," Volume 3, Page 34,
	incorrectly states "DosCreateThread can create up to 255 threads per
	process." The Reference also fails to note that DosCreateThread could
	return ERROR_TOO_MANY_TCBS.
	
	The only way to work around the current OS/2 1.x limitation with
	DosCreateThread is by starting additional processes, with each process
	being limited to 52 threads. OS/2 1.10 and 1.00 can support up to 255
	threads total for all processes in the entire system.
	
	An increase in the limit will be considered for inclusion in a future
	release.
	
	Note that threads that will be calling C run-time library functions
	should be created with _beginthread, which performs essential library
	initializations that DosCreateThread does not perform. The library
	function _beginthread is limited to creating 31 threads in C 5.10, for
	a total of 32 threads. The next version of C will support the creation
	of substantially more threads with its _beginthread.
