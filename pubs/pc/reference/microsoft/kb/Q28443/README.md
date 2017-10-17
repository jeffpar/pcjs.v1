---
layout: page
title: "Q28443: Example of Calling OS/2 Function DosRmDir"
permalink: /pubs/pc/reference/microsoft/kb/Q28443/
---

## Q28443: Example of Calling OS/2 Function DosRmDir

	Article: Q28443
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	The following is a sample program that makes OS/2 call to DosRmDir:
	
	' The DosRmDir FUNCTION declaration is found in the file BSEDOSFL.BI
	
	   DECLARE FUNCTION DosRmDir%(_
	           BYVAL P1s AS INTEGER,_
	           BYVAL P1o AS INTEGER,_
	           BYVAL P2 AS LONG)
	
	   DIM a AS LONG
	
	   Input "Enter Directory to be removed : ";dr$
	   dr$=dr$+chr$(0)
	
	   x=DosRmdir(varseg(dr$),sadd(dr$),a)
	   IF (x) THEN
	      print "An error has occurred.  The error number is ";x
	   ELSE
	      print "Directory ";dr$;" was REMOVED"
	   END IF
	   END
