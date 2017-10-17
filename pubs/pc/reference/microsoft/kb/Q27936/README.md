---
layout: page
title: "Q27936: Sample Program That Makes OS/2 Call to DosChdir"
permalink: /pubs/pc/reference/microsoft/kb/Q27936/
---

## Q27936: Sample Program That Makes OS/2 Call to DosChdir

	Article: Q27936
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	The following sample program makes an OS/2 call to DosChdir.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and Microsoft BASIC Professional Development System
	(PDS) Version 7.00 for MS OS/2.
	
	' The function declaration is found in BSEDOSFL.BI
	
	DECLARE FUNCTION DosChdir%(_
	                 BYVAL P1s AS INTEGER,_
	                 BYVAL P1o AS INTEGER,_
	                 BYVAL P2 AS LONG)
	DIM a AS LONG
	
	Input "Enter Directory: ";dr$
	dr$=dr$+chr$(0)
	x%=DosChdir%(varseg(dr$),sadd(dr$),a)
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  Print "Directory changed for the process."
	END IF
	END
