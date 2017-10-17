---
layout: page
title: "Q32272: All Event Handling Is Disabled in an ON ERROR GOTO Handler"
permalink: /pubs/pc/reference/microsoft/kb/Q32272/
---

## Q32272: All Event Handling Is Disabled in an ON ERROR GOTO Handler

	Article: Q32272
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 21-DEC-1989
	
	The following information applies to QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b and 4.50, to Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version
	7.00 for MS-DOS and MS OS/2.
	
	All event handling is suspended in an ON ERROR GOTO handler. The
	following types of events are suspended during an error trapping
	routine:
	
	1. Key trapping (ON KEY(n) GOSUB)
	
	2. Timer (ON TIMER(n) GOSUB)
	
	3. Communications (ON COM(n) GOSUB)
	
	4. Light Pen (ON PEN GOSUB)
	
	5. Joy Sticks (ON STICK GOSUB)
	
	6. User-defined events (ON UEVENT GOSUB); not available in QuickBASIC
	   versions prior to Version 4.00b and Microsoft BASIC Compiler
	   versions prior to Version 6.00.
	
	The events are enabled again as soon as the error trap is exited with
	the RESUME or RESUME NEXT statement.
	
	The following is a code example:
	
	   ON ERROR GOTO trap
	   ON KEY(1) GOSUB keytrap
	   KEY (1) ON
	   ERROR 5    ' Forces an error 5.
	   END
	
	   trap:
	     PRINT "In the error trap, enter F1"
	     while inkey$=""
	     wend
	     RESUME NEXT
	
	   keytrap:
	     Print "A key as pressed"
	     return
