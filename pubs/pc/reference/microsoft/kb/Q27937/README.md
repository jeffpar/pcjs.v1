---
layout: page
title: "Q27937: Sample Program That Makes OS/2 Call to DosQCurDir"
permalink: /pubs/pc/reference/microsoft/kb/Q27937/
---

## Q27937: Sample Program That Makes OS/2 Call to DosQCurDir

	Article: Q27937
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Below is a sample program that makes an OS/2 call to DosQCurDir.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00.
	
	' The function declaration is found in BSEDOSFL.BI
	
	DECLARE FUNCTION DOSQCURDIR%(_
	        BYVAL P1 AS INTEGER,_
	        BYVAL P2s AS INTEGER,_
	        BYVAL P2o AS INTEGER,_
	        SEG P3 AS INTEGER)
	
	DIM dirp AS STRING*80
	
	DEFINT a-z
	
	dpl=80
	number=0
	
	x=DosQCurDir%(number,varseg(dirp),varptr(dirp),dpl)
	
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  dr$=left$(dirp,instr(1,dirp,chr$(0)))
	  Print "The DIR path : ";dr$
	END IF
	END
