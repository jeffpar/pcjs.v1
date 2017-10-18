---
layout: page
title: "Q30816: MASM 5.10 OS2.DOC: OS/2 Call Summary - Date/Time Management"
permalink: /pubs/pc/reference/microsoft/kb/Q30816/
---

## Q30816: MASM 5.10 OS2.DOC: OS/2 Call Summary - Date/Time Management

	Article: Q30816
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-MAY-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 OS2.DOC file.
	
	OS/2 Call Summary
	Date and time management constant - INCL_DOSDATETIME
	
	   @DosGetDateTime - Gets the current date and time
	   Parameters - DateTime:PS
	   Structure - DATETIME
	
	   @DosSetDateTime - Sets the date and time
	   Parameters - DateTime:PS
	   Structure - DATETIME
	
	   @DosTimerAsync - Starts a timer that is asynchronous to the launching
	                    thread
	   Parameters - TimeInterval:D, SemHandle:D, Handle:PW
	
	   @DosTimerStart - Starts a periodic interval timer
	   Parameters - TimeInterval:D, SemHandle:D, Handle:PW
	
	   @DosTimerStop - Stops an interval or asynchronous timer
	   Parameters - Handle:W
