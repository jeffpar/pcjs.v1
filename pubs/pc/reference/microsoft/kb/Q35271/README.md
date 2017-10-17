---
layout: page
title: "Q35271: Sample BASIC Program That Makes OS/2 Call to DosSearchPath"
permalink: /pubs/pc/reference/microsoft/kb/Q35271/
---

## Q35271: Sample BASIC Program That Makes OS/2 Call to DosSearchPath

	Article: Q35271
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosSearchPath. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS OS/2.
	
	'This information is in the include File: BSEDOSPC.BI
	
	DECLARE FUNCTION DOSSEARCHPATH%(_
	        BYVAL P1 AS INTEGER,_
	        BYVAL P2o AS INTEGER,_
	        BYVAL P2s AS INTEGER,_
	        BYVAL P3o AS INTEGER,_
	        BYVAL P3s AS INTEGER,_
	        BYVAL P4o AS INTEGER,_
	        BYVAL P4s AS INTEGER,_
	        BYVAL P5 AS INTEGER)
	
	DEFINT a-z
	
	DIM Buffer   AS STRING*60
	CLS
	bufferlen=len(buffer)
	buffer=string$(bufferlen,32)
	
	PRINT " 0 - SEARCH DIRECTORY GIVEN AS PATH"
	PRINT " 1 - SEARCH DEFAULT THEN PATH"
	PRINT " 2 - SEARCH STRING OF DIRECTORIES"
	PRINT " 3 - SEARCH DEFAULT THEN DIRECTORIES IN ENVIRONMENT VARIABLE GIVEN"
	INPUT "Enter OPTION : ";opt
	INPUT "Enter the PATH : ";pathref$
	pathref$=pathref$+chr$(0)
	INPUT "Enter the FILENAME : ";flname$
	flname$=flname$+chr$(0)
	
	x=DosSearchPath%(opt,varseg(PathRef$),sadd(PathRef$),_
	                 varseg(FlName$),sadd(FlName$),_
	                 varseg(buffer),varptr(buffer),bufferlen)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   Print Buffer
	END IF
	end
