---
layout: page
title: "Q27938: Sample Program That Makes OS/2 Call to DosSetFileMode"
permalink: /pubs/pc/reference/microsoft/kb/Q27938/
---

## Q27938: Sample Program That Makes OS/2 Call to DosSetFileMode

	Article: Q27938
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Below is a sample program that makes an OS/2 call to DosSetFileMode.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	' The function declaration is found in BSEDOSFL.BI
	
	DECLARE FUNCTION DosSetFileMode%(_
	                 BYVAL P1s AS INTEGER,_
	                 BYVAL P1o AS INTEGER,_
	                 BYVAL P2 AS INTEGER,_
	                 BYVAL P3 AS LONG)
	DIM c AS LONG
	
	INPUT "Enter the Filename : ";flname$
	flname$=flname$+chr$(0)
	PRINT "Attributes can be: Normal = 0"
	PRINT "                   Read only = 1"
	PRINT "                   Hidden = 2"
	PRINT "                   System = 4"
	PRINT "                   Directory = 16"
	PRINT "                   Archived = 32"
	INPUT "Enter desired file attribute : ";attr%
	
	x=DosSetFileMode%(varseg(flname$),sadd(flname$),attr%,c)
	
	IF (x) THEN
	   print "An error has occurred.  The error number is ";x
	ELSE
	  print "Attribute has been changed."
	END IF
	END
