---
layout: page
title: "Q35279: Sample Program That Makes MS OS/2 Call to DosQFileMode"
permalink: /pubs/pc/reference/microsoft/kb/Q35279/
---

## Q35279: Sample Program That Makes MS OS/2 Call to DosQFileMode

	Article: Q35279
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosQfileMode. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00.
	
	'The declaration is in BSEDOSFL.BI
	DECLARE FUNCTION DOSQFILEMODE%(_
	                 BYVAL P1s AS INTEGER,_
	                 BYVAL P1o AS INTEGER,_
	                 SEG P2 AS INTEGER,_
	                 BYVAL P3 AS LONG)
	DIM c AS LONG
	INPUT "Enter the Filename : ";flname$
	flname$=flname$+chr$(0)
	x=dosqfilemode%(varseg(flname$),sadd(flname$),attr%,c)
	IF (x) then
	   print "An error has occurred.  The error number is ";x
	else
	  print "Attribute Number is ";hex$(attr%)
	end if
