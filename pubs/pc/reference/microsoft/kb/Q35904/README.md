---
layout: page
title: "Q35904: How to Call OS/2 Function DosAllocHugeSeg and DosGetHugeShift"
permalink: /pubs/pc/reference/microsoft/kb/Q35904/
---

## Q35904: How to Call OS/2 Function DosAllocHugeSeg and DosGetHugeShift

	Article: Q35904
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 functions
	DosAlocHugeSeg, DosGetHugeShift, DosReallocHuge, and DosMemAvail. This
	program can be compiled in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and Microsoft BASIC Professional Development System
	(PDS) Version 7.00 for MS OS/2.
	
	The following is code example:
	
	DECLARE FUNCTION DosAllocHuge%(_
	                 BYVAL P1 AS INTEGER,_
	                 BYVAL P2 AS INTEGER,_
	                 SEG P3 AS INTEGER,_
	                 BYVAL P4 AS INTEGER,_
	                 BYVAL P5 AS INTEGER)
	
	DECLARE FUNCTION DosGetHugeShift%(SEG P1 AS INTEGER)
	
	DECLARE FUNCTION DosReallocHuge%(_
	                 BYVAL P1 AS INTEGER,_
	                 BYVAL P2 AS INTEGER,_
	                 BYVAL P3 AS INTEGER)
	
	DECLARE FUNCTION DosMemAvail%(SEG P1 AS LONG)
	
	DEFINT A-Z
	DIM mem AS LONG
	
	CLS
	MEM=0
	x=DosMemAvail%(mem)
	
	IF (x) THEN
	   PRINT "An error occurred.  The number is : ";x
	ELSE
	   PRINT "The amount of available memory is : ";mem
	END IF
	
	INPUT "Enter the number of Segments : ";NUMSEG
	
	SIZE=0
	SELECTOR=0
	SHAREID=0
	input "Enter the Number of MAXSEG for REALLOCATION: ";MAXNUMSEG
	print
	x=DosAllocHuge%(numseg,size,selector,shareid,maxnumseg)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   PRINT "The selector is : ";selector
	END IF
	SHIFTCOUNT=0
	
	x=DosGetHugeShift%(shiftcount)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   PRINT "The Huge Shift Count is : ";shiftcount
	END IF
	
	print
	INPUT "Enter the number of segments in reallocation : ";NUMSEG
	SIZE=0
	print
	x=DosReAllocHuge%(numseg,size,selector)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   PRINT "Memory was been reallocated"
	END IF
	
	end
