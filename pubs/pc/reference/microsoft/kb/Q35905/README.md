---
layout: page
title: "Q35905: Example of BASIC Calling MS OS/2 Function DosStartSession"
permalink: /pubs/pc/reference/microsoft/kb/Q35905/
---

## Q35905: Example of BASIC Calling MS OS/2 Function DosStartSession

	Article: Q35905
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosStartSession. This program can be compiled in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC
	Professional Development System (PDS) Version 7.00.
	
	The full pathname must be specified for the program to be executed. If
	this is not done when you are using OS/2 Version 1.00, an error 203 is
	generated. OS/2 Version 1.10 and 1.20 produce an error 2.
	
	The following is a code example:
	
	'This information can be found in BSEDOSPC.BI
	TYPE ADDRESS
	  Offset    as INTEGER
	  Segment   as INTEGER
	END TYPE
	
	TYPE STARTDATA
	  cb    as INTEGER
	  Related   as INTEGER
	  FgBg      as INTEGER
	  TraceOpt  as INTEGER
	  PgmTitle  as ADDRESS
	  PgmName   as ADDRESS
	  PgmInputs as ADDRESS
	  TermQ     as ADDRESS
	END TYPE
	
	DECLARE FUNCTION DosStartSession%(_
	                 SEG P1 AS StartData,_
	                 SEG P2 AS INTEGER,_
	                 SEG P3 AS INTEGER)
	
	DIM info AS STARTDATA
	DIM apinputs AS ADDRESS, apname AS ADDRESS, aptitle AS ADDRESS
	DIM title AS STRING*32
	DIM flname AS STRING*32
	DIM pinput AS STRING*32
	
	title="BASIC TEST"+chr$(0)
	INPUT "Enter filename with extension", flname
	flname=flname+chr$(0)
	pinput=chr$(0)
	
	apname.segment=varseg(flname)
	apname.offset=varptr(flname)
	
	apinputs.segment=varseg(pinputs)
	apinputs.offset=varptr(pinputs)
	
	aptitle.segment=varseg(title)
	aptitle.offset=varptr(title)
	
	info.cb=24
	info.Related=0
	info.FgBg=1
	info.TraceOpt=0
	info.PgmTitle=aptitle
	info.PgmName=apname
	info.PgmInputs=apinputs
	
	y=DosStartSession%(info,a%,b%)
	
	if (y) then
	   print "An error occurred.  The number is : ";y
	else
	   Print "Successful"
	   while inkey$="" :wend
	end if
	END
