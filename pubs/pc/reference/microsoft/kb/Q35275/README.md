---
layout: page
title: "Q35275: Sample Program That Makes MS OS/2 Call to DosScanEnv Function"
permalink: /pubs/pc/reference/microsoft/kb/Q35275/
---

## Q35275: Sample Program That Makes MS OS/2 Call to DosScanEnv Function

	Article: Q35275
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosScanEnv. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS OS/2.
	
	'The declarations are in BSEDOSPC.BI
	TYPE address
	     offset AS INTEGER
	     segment AS INTEGER
	END TYPE
	
	DECLARE FUNCTION DOSSCANENV%(_
	        BYVAL P1s AS INTEGER,_
	        BYVAL P1o AS INTEGER,_
	        SEG P2 AS Address)
	
	DEFINT a-z
	DIM info AS address
	
	INPUT "Enter the item to be searched for in the Environment Table : ";item$
	item$=ucase$(item$)+chr$(0)
	
	x=DosScanEnv%(varseg(item$),sadd(item$),info)
	
	IF (x) THEN
	   print "An error occurred.  The error number is ";x
	ELSE
	   counter=0
	   def seg = info.segment
	   do
	     c$=chr$(peek(info.offset+counter))
	     result$=result$+c$
	     counter=counter+1
	   loop while c$<>chr$(0)
	   print item$;" = ";result$
	END IF
	END
