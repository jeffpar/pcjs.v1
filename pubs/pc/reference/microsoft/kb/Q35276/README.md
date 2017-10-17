---
layout: page
title: "Q35276: Sample Program That Makes MS OS/2 Call to DosPhysicalDisk"
permalink: /pubs/pc/reference/microsoft/kb/Q35276/
---

## Q35276: Sample Program That Makes MS OS/2 Call to DosPhysicalDisk

	Article: Q35276
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosPhysicalDisk. This program can be compiled in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS OS/2.
	
	'The declaration is in BSEDOSFL.BI
	
	DECLARE FUNCTION DOSPHYSICALDISK%(_
	        BYVAL P1 AS INTEGER,_
	        BYVAL P2s AS integer,_
	        BYVAL P2o AS integer,_
	        BYVAL P3 AS INTEGER,_
	        BYVAL P4s AS INTEGER,_
	        BYVAL P4o AS INTEGER,_
	        BYVAL P5 AS INTEGER)
	
	DEFINT a-z
	DIM DataPtr AS LONG
	DIM ParmLength AS INTEGER
	DIM DataBuff AS STRING*2
	DIM ParmBuff AS STRING*3
	
	databuff="**"
	
	func = 1
	DataLength = 2
	ParmLength = 0
	
	x=DosPhysicalDisk%(func,varseg(DataBuff),varptr(DataBuff),datalength,_
	                   0,0,parmlength)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   PRINT "Number partitionable drives: ";
	   PRINT asc(mid$(databuff,1,1));asc(mid$(databuff,2,2))
	END IF
	
	func = 2
	DataLength = 2
	ParmLength = 3
	ParmBuff="1:"+chr$(0)
	x=DosPhysicalDisk%(func,varseg(DataBuff),varptr(DataBuff),datalength,_
	                   varseg(Parmbuff),varptr(ParmBuff),parmlength)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   PRINT "Handle: ";
	   PRINT asc(mid$(databuff,1,1));asc(mid$(databuff,2,2))
	END IF
	END
