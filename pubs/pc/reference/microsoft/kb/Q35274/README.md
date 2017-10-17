---
layout: page
title: "Q35274: Sample Program That Makes MS OS/2 Call to DosSleep Function"
permalink: /pubs/pc/reference/microsoft/kb/Q35274/
---

## Q35274: Sample Program That Makes MS OS/2 Call to DosSleep Function

	Article: Q35274
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosSleep. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS OS/2.
	
	'The declaration is in BSEDOSPC.BI
	DECLARE FUNCTION DOSSLEEP%(BYVAL P1 AS LONG)
	
	DIM a AS LONG
	
	INPUT "Enter the amount of time to SLEEP (in seconds) :";longer
	
	longer=longer*1000
	
	x=timer
	y=DosSleep%(longer)
	z=timer
	
	IF (y) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  Print "The amount of time you slept is : ";z-x
	END IF
	end
