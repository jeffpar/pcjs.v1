---
layout: page
title: "Q37772: BASIC Example to Call OS/2 Function DosSetVerify, DosQVerify"
permalink: /pubs/pc/reference/microsoft/kb/Q37772/
---

## Q37772: BASIC Example to Call OS/2 Function DosSetVerify, DosQVerify

	Article: Q37772
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	The sample program below makes a call to the MS OS/2 functions
	DosSetVerify and DosQVerify. This program can be compiled in Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS OS/2 and in Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS OS/2.
	
	The program is as follows:
	
	DEFINT A-Z
	
	'The declarations can be found in BSEDOSFL.BI
	
	DECLARE FUNCTION DosSetVerify%(_
	                 BYVAL P1 AS INTEGER)
	
	DECLARE FUNCTION DosQVerify%(_
	                 SEG P1 AS INTEGER)
	
	x=DosQVerify(opt%)
	
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  SELECT CASE opt%
	     CASE 0
	        Print "Verify is off"
	     CASE 1
	        PRINT "Verify is on"
	     CASE ELSE
	        PRINT "An unexpected error occurred."
	  END SELECT
	END IF
	
	Print  "(0) to deactivate verify "
	input  "(1) to activate for this Application : ";opt%
	
	x=DosSetVerify(opt%)
	
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  SELECT CASE opt%
	     CASE 0
	        Print "Verify is set off"
	     CASE 1
	        PRINT "Verify is set on"
	     CASE ELSE
	        PRINT "An unexpected error occurred."
	  END SELECT
	END IF
	INPUT "Enter Any Key to Verify the Status of VERIFY";a$
	
	x=DosQVerify(opt%)
	
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  SELECT CASE opt%
	     CASE 0
	        Print "Verify is off"
	     CASE 1
	        PRINT "Verify is on"
	     CASE ELSE
	        PRINT "An unexpected error occurred."
	  END SELECT
	END IF
	END
