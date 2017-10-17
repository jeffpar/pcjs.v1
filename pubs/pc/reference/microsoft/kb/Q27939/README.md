---
layout: page
title: "Q27939: Sample Program That Makes OS/2 Call to DosMkdir"
permalink: /pubs/pc/reference/microsoft/kb/Q27939/
---

## Q27939: Sample Program That Makes OS/2 Call to DosMkdir

	Article: Q27939
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Below is a sample program that makes a call to the OS/2 DosMkdir
	routine.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	' The function declaration is found in BSEDOSFL.BI.
	
	DECLARE FUNCTION DosMkdir%(_
	                 BYVAL P1s AS INTEGER,_
	                 BYVAL P1o AS INTEGER,_
	                 BYVAL P2 AS LONG)
	
	DIM a AS LONG
	
	Input "Enter the directory : ";dr$
	dr$=dr$+chr$(0)
	
	x=DosMkdir(varseg(dr$),sadd(dr$),a)
	
	IF (x) THEN
	   print "An error has occurred.  The error number is ";x
	ELSE
	  print "Directory was made"
	END IF
	END
