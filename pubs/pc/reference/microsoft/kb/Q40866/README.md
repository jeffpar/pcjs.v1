---
layout: page
title: "Q40866: BC 6.00 Example of OS/2 API Calls DosGetPrty, DosSetPrty"
permalink: /pubs/pc/reference/microsoft/kb/Q40866/
---

## Q40866: BC 6.00 Example of OS/2 API Calls DosGetPrty, DosSetPrty

	Article: Q40866
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890125-56
	Last Modified: 1-FEB-1990
	
	Below is a sample program that calls the MS OS/2 API functions
	DosGetPrty and DosSetPrty. This program can be compiled in Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS OS/2.
	
	The following is the sample program:
	
	REM $INCLUDE: 'BSEDOSPC.BI'
	DEFINT a-z
	DIM pids AS PidInfo
	
	x%=DosGetPid(pids)
	IF (x%) THEN
	   PRINT "An error occurred in DosGetPid: ";x%
	   END
	ELSE
	   pid=pids.pid
	   scope = 0
	   x% = DosGetPrty(scope,priority,pid)
	   IF (x%) THEN
	       PRINT "An error occurred in DosGetPrty: ";x%
	       END
	   ELSE
	      PRINT
	      PRINT "Priority: "; Priority
	      PRINT
	      CALL SetPrty(pid)
	      PRINT
	      PRINT "Enter a Key to Verify Change..."
	      WHILE INKEY$="": WEND
	      scope=0
	      x%=DosGetPrty(scope,priority,pid)
	      IF (x%) THEN
	         PRINT "An error Occurred in DosGetPrty: ";x%
	         END
	      ELSE
	         PRINT
	         PRINT "Priority: "; Priority
	      END IF
	   END IF
	END IF
	END
	
	SUB SetPrty(pid) STATIC
	    Print "Enter the SCOPE (0 - Process and all threads)"
	    PRINT "                (1 - Process and all the descendants)"
	    PRINT "                (2 - Thread calling the function)"
	    INPUT "                                         OPTION: ";scope
	    PRINT
	    PRINT "Enter the CLASS (0 - No Change)"
	    PRINT "                (1 - Idle-time)"
	    PRINT "                (2 - Regular)"
	    PRINT "                (3 - Time-Critical)"
	    INPUT "                             OPTION: ";class
	    PRINT
	    INPUT "Enter CHANGE (-31 to + 31) : "; change
	    x% = DosSetPrty%(scope,class,change,pid)
	    if (x%) then
	        PRINT "Error setting Priority - ";x%
	    else
	        PRINT "Priority Changed."
	    end if
	END SUB
