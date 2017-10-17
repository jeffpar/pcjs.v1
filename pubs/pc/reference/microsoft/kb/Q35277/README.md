---
layout: page
title: "Q35277: Sample Program That Makes MS OS/2 Call to DosDelete Function"
permalink: /pubs/pc/reference/microsoft/kb/Q35277/
---

## Q35277: Sample Program That Makes MS OS/2 Call to DosDelete Function

	Article: Q35277
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosDelete. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS OS/2.
	
	'The declaration is in BSEDOSFL.BI
	DECLARE FUNCTION DOSDELETE%(_
	                 BYVAL P1o AS INTEGER,_
	                 BYVAL P1s AS INTEGER,_
	                 BYVAL P2 AS LONG)
	
	DEFINT A-Z
	DIM reserved AS LONG
	
	INPUT "Enter the file to be deleted : ";fl$
	fl$=fl$+chr$(0)
	
	x=DosDelete%(varseg(fl$),sadd(fl$),reserved)
	
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  Print fl$; "was DELETED"
	END IF
	end
