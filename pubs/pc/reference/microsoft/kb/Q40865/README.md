---
layout: page
title: "Q40865: BC 6.00 Example to Manipulate File with OS/2 API Calls"
permalink: /pubs/pc/reference/microsoft/kb/Q40865/
---

## Q40865: BC 6.00 Example to Manipulate File with OS/2 API Calls

	Article: Q40865
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890125-57
	Last Modified: 1-FEB-1990
	
	Below is a sample program that calls the following MS OS/2 API
	functions:
	
	   DosBufReset
	   DosChgFilePtr
	   DosClose
	   DosOpen
	   DosQFHandState
	   DosQHandType
	   DosRead
	   DosSetFHandState
	   DosWrite
	
	This program can be compiled in Microsoft BASIC Compiler Version 6.00
	or 6.00b for MS OS/2 and Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	The following is the sample program:
	
	CONST TRUE=-1
	CONST FALSE=0
	
	REM $INCLUDE: 'BSEDOSFL.BI'
	DEFINT A-Z
	DIM sizel AS LONG
	DIM reserved AS LONG
	DIM buf AS STRING*512
	DIM distance AS LONG
	DIM NewPointer AS LONG
	
	CLS
	input "Enter the Filename : ";fl$
	fl$=fl$+chr$(0)
	openflag = 17
	openmode = &h6092
	PRINT
	PRINT "Enter a Key to OPEN the file"
	WHILE INKEY$="" : WEND
	PRINT
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
	  buffer$=string$(size/4,65)+string$(size/4,66)
	  buffer$=buffer$+string$(size/4,67)+string$(size/4,68)+chr$(0)
	  PRINT
	  PRINT "Enter a Key to WRITE to the file"
	  WHILE INKEY$="" : WEND
	  PRINT
	  x=DosWrite%(handle,varseg(buffer$),sadd(buffer$),size,nw)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    print "The information was placed into the file."
	    print "The number of bytes written was : ";nw
	  END IF
	END IF
	PRINT
	PRINT "Enter a Key to CLOSE the file"
	WHILE INKEY$="" : WEND
	PRINT
	
	x=DosClose%(handle)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The file is closed." : print
	END IF
	PRINT
	PRINT "Enter a Key to RE-OPEN the file"
	WHILE INKEY$="" : WEND
	PRINT
	x=DosOpen(varseg(fl$),sadd(fl$),handle,action,sizel,_
	          filea,openflag,openmode,reserved)
	
	IF x THEN
	   print "error: ";x
	   stop
	END IF
	DONE=FALSE
	WHILE NOT(done)
	  size=256
	  buf=string$(size,42)
	  PRINT
	  PRINT "Enter a Key to READ the file"
	  WHILE INKEY$="" : WEND
	  PRINT
	
	  x=DosRead%(handle,varseg(buf),varptr(buf),size,nr)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    IF nr=0 THEN
	       PRINT "EOF Detected"
	       DONE=TRUE
	    ELSE
	       PRINT "The number of bytes read is : ";nr
	       PRINT "The bytes were : ";buf
	    END IF
	  END IF
	WEND
	  PRINT
	  PRINT "Enter a Key to RESET the file BUFFER"
	  WHILE INKEY$="" : WEND
	  PRINT
	  x=DosBufReset%(handle)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    PRINT "The BUFFER was flushed"
	  END IF
	PRINT
	PRINT "Enter a Key to CHANGE the file POINTER"
	WHILE INKEY$="" : WEND
	PRINT
	distance=192
	MoveType=0
	
	x=DosChgFilePtr%(handle,distance,MoveType,NewPointer)
	IF (x) THEN
	  Print "An error occurred.  The number is : ";x
	ELSE
	  Print "The file pointer is moved.  The information will be read."
	  size=256
	  buf=string$(size,42)
	  PRINT
	  PRINT "Enter a Key to READ the file"
	  WHILE INKEY$="" : WEND
	  PRINT
	
	  x=DosRead%(handle,varseg(buf),varptr(buf),size,nr)
	  IF (x) THEN
	    Print "An error occurred.  The number is : ";x
	  ELSE
	    IF nr=0 THEN
	       PRINT "EOF Detected"
	       DONE=TRUE
	    ELSE
	       PRINT "The number of bytes read is : ";nr
	       PRINT "The bytes were : ";buf
	    END IF
	  END IF
	END IF
	PRINT
	PRINT "Enter a Key to get the GET/Modify File Handle State"
	WHILE INKEY$="" : WEND
	PRINT
	
	x=DosQFHandState%(handle,FileHandleState)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The filehandle state is : ";FileHandleState
	END IF
	
	NewHandState=&h0010
	x=DosSetFHandState%(handle,NewHandleState)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The filehandle state was changed."
	END IF
	
	x=DosQFHandState%(handle,FileHandleState)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The filehandle state is : ";FileHandleState
	END IF
	
	x=DosQHandType%(handle,HandType,FlagWord)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   IF (HandleType) THEN
	       print "The handle type is a Device handle"
	       print "The Flag Word is : ";Flag Word
	   ELSE
	       print "The handle type is a File-System handle"
	   END IF
	END IF
	PRINT
	PRINT "Enter a Key to CLOSE the file"
	WHILE INKEY$="" : WEND
	PRINT
	x=DosClose%(handle)
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   print "The file is closed."
	END IF
	END
