---
layout: page
title: "Q61438: Slow Printing from BASIC to Network Printer Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q61438/
---

## Q61438: Slow Printing from BASIC to Network Printer Under OS/2

	Article: Q61438
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S900122-142
	Last Modified: 10-MAY-1990
	
	BASIC prints very slowly to a networked printer under OS/2 when
	compared to the same printing under DOS or the OS/2 DOS box. The
	printing speed is the same under OS/2 versions 1.00, 1.10, and 1.20.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) version 7.00 for MS OS/2.
	
	The following code, PTEST.BAS, demonstrates the slow printing speeds
	under OS/2. Compile and LINK the program as follows:
	
	   BC /O PTEST.BAS ;
	   LINK PTEST ;
	
	The following is the program PTEST.BAS:
	
	   start = TIMER
	   FOR x = 1 TO 50
	      LPRINT "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLM:";x
	   NEXT
	   PRINT "Final time: "; TIMER - start
	
	The following is the output from a 386 machine running at 16Mhz with
	the print spooler disabled:
	
	   Operating System     Printer          Time (seconds)
	   ----------------     -------          ----
	
	   OS/2                 Network            64
	   DOS box              Network             6
	   DOS 4.01             Network             4
	   OS/2                 Direct             46
	   DOS                  Direct             46
	
	Note: The direct connect times are longer because the printer has no
	spooler, and therefore, the computer must wait for the printer to
	print each line. Also, a similar C routine prints at normal speed
	under OS/2.
