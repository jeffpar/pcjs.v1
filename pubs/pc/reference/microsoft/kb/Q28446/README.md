---
layout: page
title: "Q28446: Example of Calling OS/2 Function DosGetEnv"
permalink: /pubs/pc/reference/microsoft/kb/Q28446/
---

## Q28446: Example of Calling OS/2 Function DosGetEnv

	Article: Q28446
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Below is a sample program that invokes the OS/2 function DosGetEnv.
	
	' The function declarations are found in file BSEDOSPC.BI
	
	DECLARE FUNCTION DosGetEnv%(_
	        SEG P1 AS INTEGER,_
	        SEG P2 AS INTEGER)
	cls
	x=DosGetEnv(y%,z%)
	
	IF (x) then
	  Print "An error occurred.  The error number is ";x
	ELSE
	  Print "Address to Place Segment Handle : ";y%
	  Print "Address to Place Command Line Start : ",z%
	END IF
	
	def seg = y%
	
	PRINT "THE INFORMATION IN THE ENVIRONMENT TABLE :" : PRINT
	
	For i = 0 to z%-20
	  t%=peek(i)
	  IF t%=42 THEN
	     hold%=i
	  END IF
	
	  IF t% = 0 THEN
	    print " "
	  ELSE
	    print chr$(t%);
	  END IF
	next i
	print
	i = 0
	PRINT "The Command Line Argument is : ";
	
	DO
	 t%=peek(z%+i)
	 print chr$(t%);
	 i = i + 1
	LOOP WHILE t% <> 0
	PRINT " "
	
	print
	PRINT "POKING SOME INFORMATION INTO THE ENVIRONMENT TABLE... " : print
	PRINT
	
	IF hold%<>0 THEN
	   for i = 0 to 9
	     poke hold%-i, 74-i
	   next i
	   def seg
	   PRINT "The information was poked into the environment variable FOO;"
	   PRINT "which was previously set to **********"
	
	   print "The NEW contents of FOO  : ";environ$("FOO") : print
	   Print "When the program is exited, notice the environment table";
	   Print "isn't changed."
	   PRINT "BASCOM uses only a copy of the actual DOS environment table"
	   print
	ELSE
	   print "The FOO environment variable is not set. "
	   print "To have the complete demo, set the FOO=**********"
	END IF
	END
