---
layout: page
title: "Q40868: BC 6.00 Example of OS/2 API Function Call DosExecPgm"
permalink: /pubs/pc/reference/microsoft/kb/Q40868/
---

## Q40868: BC 6.00 Example of OS/2 API Function Call DosExecPgm

	Article: Q40868
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890125-54
	Last Modified: 1-FEB-1990
	
	Below is an example of using the MS OS/2 API function DosExecPgm. This
	program must be compiled with Microsoft BASIC Compiler Versions 6.00
	or 6.00b for MS OS/2 or Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	The following is the example code:
	
	'The definitions are taken from BSEDOSPC.BI
	TYPE ResultCodes
	     codeterminate as integer
	     coderesult as integer
	END TYPE
	DECLARE FUNCTION DosExecPgm%(_
	        BYVAL p1S AS INTEGER,_
	        BYVAL p1o AS INTEGER,_
	        BYVAL p2  AS INTEGER,_
	        BYVAL p3  AS INTEGER,_
	        BYVAL p4s AS INTEGER,_
	        BYVAL p4o AS INTEGER,_
	        BYVAL p5s AS INTEGER,_
	        BYVAL p5o AS INTEGER,_
	        SEG   p6  AS ResultCodes,_
	        BYVAL p7s AS INTEGER,_
	        BYVAL p7o AS INTEGER)
	DEFINT A-Z
	DIM results as ResultCodes
	
	INPUT "Enter NAME of EXE file (with .EXE) to execute: "; fln$
	fln$ = fln$ + chr$(0)
	buffer$=space$(255)+chr$(0)
	bufferlen = len(buffer$)
	AsyncTraceFlags = 1  'Execute Asynchronously to the parent
	ArgPointer$=chr$(0)
	EnvPointer$=chr$(0)
	x% = DosExecPgm(varseg(buffer$),sadd(buffer$),_
	                bufferlen,AsyncTraceFlags,_
	                varseg(ArgPointer$),sadd(ArgPointer$),_
	                varseg(EnvPointer$),sadd(EnvPointer$),_
	                results, varseg(fln$),sadd(fln$))
	PRINT "ExecPgm Error CODE : ";x%
	SLEEP(5)
	PRINT "This Parent is Complete"
	END
