---
layout: page
title: "Q40867: BC 6.00 Example of OS/2 API Calls DosError, DosErrClass"
permalink: /pubs/pc/reference/microsoft/kb/Q40867/
---

## Q40867: BC 6.00 Example of OS/2 API Calls DosError, DosErrClass

	Article: Q40867
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | SR# S890125-55
	Last Modified: 1-FEB-1990
	
	Below is an example of using the MS OS/2 API function DosError and
	DosErrClass. This program must be compiled with Microsoft BASIC
	Compiler Version 6.00 and 6.00b for MS OS/2 and Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS OS/2.
	
	The following is the sample program:
	
	DEFINT a-z
	REM $include: 'bsedosfl.bi'
	REM $include: 'bsedospc.bi'
	PRINT "Note: This only affects OS/2 API calls you call"
	PRINT "      BASIC handles its own errors"
	PRINT
	PRINT "Enter (0) to SUSPEND system hard-error processing"
	INPUT "or (1) to RESUME system hard-error processing : ";y%
	PRINT
	x=DOSERROR%(y%)
	
	IF (x) THEN
	   Print "An error occurred.  The number is : ";x
	ELSE
	   Print "Hard-Error Processing Suspended"
	   Print "Open Drive Door A and Enter any Key..."
	   PRINT
	   WHILE INKEY$="" : WEND
	END IF
	fl$="A:\ABC.EXE"+chr$(0)
	
	code%=DosQFileMode(varseg(fl$),sadd(fl$),attribute%,0&)
	if (code%) then
	   Print "Error Returned from DosQFileMode: " code%
	   x% = DosErrClass(code%,class%,action%,locus%)
	   IF (x%) THEN
	      PRINT "An error was received determining class"
	   ELSE
	      CALL DetermineError(class%,action%,locus%)
	   END IF
	END IF
	END
	
	SUB DetermineError(class%,action%,locus%) STATIC
	PRINT "Error Class: ";
	SELECT CASE class%
	       CASE 1
	         PRINT "ERRCLASS_OUTRES ==> Out of Resource"
	       CASE 2
	         PRINT "ERRCLASS_TEMPSIT ==> This is a Temporary Situation"
	       CASE 3
	         PRINT "ERRCLASS_AUTH ==> Authorization has failed"
	       CASE 4
	         PRINT "ERRCLASS_INTRN ==> An Internal Error has Occurred"
	       CASE 5
	         PRINT "ERRCLASS_HRDFAIL ==> A Device Hardware Failure"
	       CASE 6
	         PRINT "ERRCLASS_SYSFAIL ==> A System Failure has Occurred"
	       CASE 7
	PRINT "ERRCLASS_APPERR ==> A Probable Application Error has Occurred"
	       CASE 8
	         PRINT "ERRCLASS_NOTFND ==> The Item was not Located"
	       CASE 9
	         PRINT "ERRCLASS_BADFMT ==> Bad Format"
	       CASE 10
	         PRINT "ERRCLASS_LOCKED ==> Locked"
	       CASE 11
	PRINT "ERRCLASS_MEDIA ==> Incorrect Media; a CRC Error has Occurred"
	       CASE 12
	         PRINT "ERRCLASS_ALREADY ==> Everything is Ready"
	       CASE 13
	         PRINT "ERRCLASS_UNK ==> Error is Unclassified"
	       CASE 14
	         PRINT "ERRCLASS_CANT ==> Cannot perform Requested Action"
	       CASE 15
	         PRINT "ERRCLASS_TIME ==> Time-out has Occurred"
	       CASE ELSE
	         PRINT "UnKnown Class"
	END SELECT
	Print "Recommended Action: ";
	SELECT CASE action%
	       CASE 1
	         PRINT "ERRACT_RETRY ==> Retry Immediately"
	       CASE 2
	         PRINT "ERRACT_DLYRET ==> Delay and Retry"
	       CASE 3
	         PRINT "ERRACT_USER ==> Bad User Input; Get New values"
	       CASE 4
	         PRINT "ERRACT_ABORT ==> Terminate in an Orderly Manner"
	       CASE 5
	         PRINT "ERRACT_PANIC ==> Terminate Immediately"
	       CASE 6
	         PRINT "ERRACT_IGNORE ==> Ignore the Error"
	       CASE 7
	         PRINT "ERRACT_INTRET ==> Retry After User Intervention"
	       CASE ELSE
	         PRINT "UnKnown Class"
	END SELECT
	PRINT "Location: ";
	SELECT CASE locus%
	       CASE 1
	         PRINT "ERRLOC_UNK ==> The Origin of the Error is Unknown"
	       CASE 2
	         PRINT "ERRLOC_DISK ==> The Error Occurred in a Random-Access"
	         PRINT "                Device, such as a Disk Drive"
	       CASE 3
	         PRINT "ERRLOC_NET ==> This is a Network Error"
	       CASE 4
	         PRINT "ERRLOC_SERDEV ==> This is a Serial-Device Error"
	       CASE 5
	         PRINT "ERRLOC_MEM ==> This is a Memory Parameter Error"
	       CASE ELSE
	         PRINT "Unknown Location Error"
	END SELECT
	END SUB
