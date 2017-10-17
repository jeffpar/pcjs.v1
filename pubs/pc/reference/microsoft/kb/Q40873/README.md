---
layout: page
title: "Q40873: BC 6.00 Example of OS/2 API Function Call DosDupHandle"
permalink: /pubs/pc/reference/microsoft/kb/Q40873/
---

## Q40873: BC 6.00 Example of OS/2 API Function Call DosDupHandle

	Article: Q40873
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890125-58
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 API
	function DosDupHandle. It also uses the following MS OS/2 API
	functions:
	
	   DosOpen
	   DosRead
	   DosWrite
	   DosClose
	
	This program can be compiled in Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS OS/2 and Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	The following is the sample program:
	
	CONST TRUE=-1
	CONST FALSE=0
	REM $include: 'BSEDOSFL.BI'
	
	DEFINT A-Z
	DIM sizel AS LONG
	DIM reserved AS LONG
	DIM buf AS STRING*512
	DIM distance AS LONG
	DIM NewPointer AS LONG
	CLS
	
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
	  print "The handle is : ";handle
	  print "The action is : ";action
	  print "The size is   : ";sizel
	  print "The filea is  : ";filea
	  print "The openflag  : ";openflag
	  print "The openmode  : ";openmode
	  size=512
	  buffer$=string$(size/4,65)+string$(size/4,66)+string$(size/4,67)
	  buffer$=buffer$+string$(size/4,68)+chr$(0)
	
	  x=DosWrite%(handle,varseg(buffer$),sadd(buffer$),size,nw)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    print "The information was placed into the file."
	    print "The number of bytes written was : ";nw
	  END IF
	END IF
	
	x=DosClose%(handle)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The file is closed." : print
	END IF
	print "Enter Any Key OPEN file and DUPLICATE Handle..."
	while inkey$="" :wend
	
	x=DosOpen(varseg(fl$),sadd(fl$),handle,action,sizel,_
	          filea,openflag,openmode,reserved)
	x=DosDupHandle%(handle,newhandle)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    Print "Handle was Duplicated."
	  END IF
	PRINT
	PRINT "Enter any Key to READ with Both handles"
	PRINT
	WHILE INKEY$="" : WEND
	size=256
	buf=string$(size,42)
	x=DosRead%(handle,varseg(buf),varptr(buf),size,nr)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    IF nr=0 THEN
	       PRINT "EOF Detected"
	    ELSE
	       PRINT "ORIGINAL HANDLE"
	       PRINT "The number of bytes read is : ";nr
	       PRINT "The bytes were : ";buf
	    END IF
	  END IF
	size=256
	buf=string$(size,42)
	x=DosRead%(newhandle,varseg(buf),varptr(buf),size,nr)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    IF nr=0 THEN
	       PRINT "EOF Detected"
	    ELSE
	       PRINT "NEW HANDLE"
	       PRINT "The number of bytes read is : ";nr
	       PRINT "The bytes were : ";buf
	    END IF
	  END IF
	
	x=DosClose%(handle)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The file is closed."
	END IF
	END
