---
layout: page
title: "Q28447: Calling OS/2 DOSInsMessage, DOSGetMessage, DOSPutMessage"
permalink: /pubs/pc/reference/microsoft/kb/Q28447/
---

## Q28447: Calling OS/2 DOSInsMessage, DOSGetMessage, DOSPutMessage

	Article: Q28447
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Below is an example of calling OS/2 DOSInsMessage, DOSGetMessage, and
	DOSPutMessage.
	
	' The function declarations are found in file BSEDOSPC.BI
	
	TYPE ADDRESS
	     OFFSET  AS INTEGER
	     SEGMENT AS INTEGER
	END TYPE
	
	DECLARE FUNCTION DOSINSMESSAGE%(_
	        BYVAL P1s AS INTEGER,_
	        BYVAL P1o AS INTEGER,_
	        BYVAL P2  AS INTEGER,_
	        BYVAL P3s AS INTEGER,_
	        BYVAL P3o AS INTEGER,_
	        BYVAL P4  AS INTEGER,_
	        BYVAL P5s AS INTEGER,_
	        BYVAL P5o AS INTEGER,_
	        BYVAL P6  AS INTEGER,_
	        SEG   P7  AS INTEGER)
	
	DECLARE FUNCTION DOSGETMESSAGE%(_
	        BYVAL P1s AS INTEGER,_
	        BYVAL P1o AS INTEGER,_
	        BYVAL P2  AS INTEGER,_
	        BYVAL P3s AS INTEGER,_
	        BYVAL P3o AS INTEGER,_
	        BYVAL P4  AS INTEGER,_
	        BYVAL P5  AS INTEGER,_
	        BYVAL P6s AS INTEGER,_
	        BYVAL P6o AS INTEGER,_
	        SEG   P7  AS INTEGER)
	
	DECLARE FUNCTION DOSPUTMESSAGE%(_
	        BYVAL P1  AS INTEGER,_
	        BYVAL P2  AS INTEGER,_
	        BYVAL P3s AS INTEGER,_
	        BYVAL P3o AS INTEGER)
	
	DEFINT a-z
	
	DIM VarTable(9) AS ADDRESS   'Array of address of Strings
	VarCount=2
	CLS
	MsgIn$="This is a test.  My Name is %1 %2"+chr$(0)
	MsgInLen=len(MsgIn$)
	
	DIM MsgOut AS STRING*80
	
	MsgOutLen=len(MsgOut)
	MsgOut=string$(MsgOutLen-1,32)
	
	one$="Joe"+chr$(0)
	two$="Smith"+chr$(0)
	
	VarTable(0).offset=sadd(one$)
	VarTable(0).segment=varseg(one$)
	VarTable(1).offset=sadd(two$)
	VarTable(1).segment=varseg(two$)
	
	x=DosInsMessage%(varseg(VarTable(0)),varptr(VarTable(0)),VarCount,_
	                 varseg(MsgIn$),sadd(MsgIn$),MsgInLen,_
	                 varseg(MsgOut),varptr(MsgOut),MsgOutLen,number)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	  print MsgOut
	END IF
	
	DIM buffer as STRING*80
	BufferLen=80
	
	'This is a file by the OS/2 Message Utilities.
	'See Microsoft OS/2 Programmer's Guide, Section 20.5, Pages 205-212)
	
	Filename$="JoeSmith.msg"+chr$(0)
	
	FOR i = 100 to 104
	x=DosGetMessage%(varseg(VarTable(0)),varptr(VarTable(0)),VarCount,_
	                 varseg(buffer),varptr(buffer),BufferLen,_
	                 i,varseg(filename$),sadd(filename$),number)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	  x=DosPutMessage(1,number,varseg(buffer),varptr(buffer))
	  IF (x) THEN
	     Print "An error occurred.  The number is : ";x
	  END IF
	END IF
	NEXT i
	locate 10,1
	
	END
