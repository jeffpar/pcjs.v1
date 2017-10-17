---
layout: page
title: "Q45451: CLEAR Resets ON ERROR GOTO and Turns Off Error Trapping"
permalink: /pubs/pc/reference/microsoft/kb/Q45451/
---

## Q45451: CLEAR Resets ON ERROR GOTO and Turns Off Error Trapping

	Article: Q45451
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890224-103 B_BasicCom
	Last Modified: 13-DEC-1989
	
	The CLEAR statement in a QuickBASIC program turns off error handling
	routines. Any error that happens after a CLEAR statement is not
	trapped by an error handling routine that was initiated before the
	CLEAR statement. To trap errors after a CLEAR statement, you must
	reinstate the error handling routine with a new ON ERROR GOTO clause.
	
	This applies to Microsoft QuickBASIC Versions 3.00, 4.00, 4.00b, and
	4.50, and Microsoft BASIC Compiler Versions 6.00, 6.00b for MS-DOS and
	MS OS/2, and Microsoft BASIC PDS 7.00 for MS-DOS and MS OS/2.
	
	The following two programs show an error trapping routine that does
	not work correctly and an error trapping routine that does work:
	
	Program 1
	---------
	
	REM  This error handling routine will not trap the error.
	  ON ERROR GOTO Handler
	  CLEAR
	REM The ERROR handling routine is now turned off
	  ERROR 1
	END
	Handler: Print "In the ERROR Handler"
	         RESUME
	
	The output for this program is only an error message from QuickBASIC.
	
	Program 2
	---------
	
	REM This ERROR Handling routine will trap the error.
	  ON ERROR GOTO Handler
	  CLEAR
	REM The ERROR Handling routine is now turned off.
	  ON ERROR GOTO Handler
	REM The ERROR Handling routine is now turned back on.
	  ERROR 1
	END
	Handler : Print "In the ERROR Handler"
	          RESUME
	
	The output for this program is as follows:
	
	   In the ERROR Handler
