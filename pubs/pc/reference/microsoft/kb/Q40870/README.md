---
layout: page
title: "Q40870: BC 6.00 Example of OS/2 API Function Call DosNewSize"
permalink: /pubs/pc/reference/microsoft/kb/Q40870/
---

## Q40870: BC 6.00 Example of OS/2 API Function Call DosNewSize

	Article: Q40870
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890125-34
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 API
	function DosNewSize. This function can be used to truncate or expand a
	file. If the file is expanded, the new bytes are undefined. The
	program also makes calls to DosOpen and DosClose.
	
	The program can be compiled in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS OS/2 and Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	The following is the sample program:
	
	REM $INCLUDE: 'bsedosfl.bi'
	DEFINT a-z
	CLS
	DIM filelist AS FileStatus
	DIM sizel AS LONG
	DIM reserved AS LONG
	DIM buf AS STRING*512
	DIM distance AS LONG
	DIM NewPointer AS LONG
	
	input "Enter the Filename : ";fl$
	fl$=fl$+chr$(0)
	openflag=17
	openmode=&h6092
	
	x=DosOpen(varseg(fl$),sadd(fl$),handle,action,sizel,_
	          filea,openflag,openmode,reserved)
	
	IF (x) THEN
	   print "An error occurred.  The number is : ";x
	   end
	ELSE
	  input "Enter the new size ",newsize&
	  x=DosNewSize(handle,newsize&)
	  IF (x) THEN
	     Print "An error occurred.  The number is : ";x
	  ELSE
	     Print "File size was changed"
	  END IF
	  x=DosClose%(handle)
	  IF (x) THEN
	     color 7 :PRINT "An error occurred. The number is : ";x :color 15
	  ELSE
	     print "File Closed."
	     print "Enter any key to exit..."
	     while inkey$="" :wend
	  END IF
	END IF
	END
