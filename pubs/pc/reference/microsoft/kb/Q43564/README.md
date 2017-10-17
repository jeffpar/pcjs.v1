---
layout: page
title: "Q43564: L2025: Symbol Already Defined Error Caused by SIGNAL.H in .QLB"
permalink: /pubs/pc/reference/microsoft/kb/Q43564/
---

## Q43564: L2025: Symbol Already Defined Error Caused by SIGNAL.H in .QLB

	Article: Q43564
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b buglist4.50
	Last Modified: 20-SEP-1990
	
	LINKing C subfunctions into a QuickBASIC Quick library (.QLB) may
	generate many "L2025: Symbol defined more than once" errors. This can
	be caused when the C subfunction is compiled with the SIGNAL.H C
	include file that comes with Microsoft QuickC version 2.00 and
	Microsoft C Compiler versions 5.00, 5.10, and 6.00.
	
	If the SIGNAL.H include file is not used, or if the C subfunction is
	directly LINKed to the BASIC program when producing an .EXE file, the
	errors do not occur.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	versions 4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler versions
	6.00 and 6.00b (buglist6.00, buglist6.00b); and in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10
	(buglist7.00, buglist7.10). We are researching this problem and will
	post new information here as it becomes available.
	
	Below is the source code that, when LINKed into a Quick library, will
	create the "Symbol defined more than once" errors.
	
	C Routine
	---------
	
	/* SIGNAL.C */
	/* Demonstration of signal.h failing with QuickBASIC 4.50 */
	
	#include <signal.h>
	
	int handler ()
	{  }
	void far testc()
	{
	    signal(SIGINT, handler);
	}
	
	Link Command
	------------
	
	   LINK /Q SIGNAL.OBJ,,,BQLB45.LIB;
	
	The Quick library support module used in the above LINK line should be
	BQLB45.LIB in QuickBASIC 4.50, BQLB41.LIB in QuickBASIC 4.00b or BASIC
	Compiler 6.00b, BQLB40.LIB in QuickBASIC 4.00 or BASIC Compiler 6.00,
	and QBXQLB.LIB in BASIC PDS 7.00 or 7.10.
