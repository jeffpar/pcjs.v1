---
layout: page
title: "Q43902: Incorrect SEEK Statement Example on QB Advisor On-Line Help"
permalink: /pubs/pc/reference/microsoft/kb/Q43902/
---

## Q43902: Incorrect SEEK Statement Example on QB Advisor On-Line Help

	Article: Q43902
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890424-3 docerr
	Last Modified: 15-DEC-1989
	
	There are several errors in the example for the SEEK statement in the
	QuickBASIC Advisor on-line Help system for QuickBASIC Version 4.50.
	The lines that should be corrected are marked in the code sample
	below.
	
	The example given on Page 385 of the "Microsoft QuickBASIC 4.0: BASIC
	Language Reference" operates correctly.
	
	This documentation error has been corrected in the Microsoft Advisor
	on-line Help system of the QBX.EXE environment supplied with
	Microsoft BASIC PDS Version 7.00. Below is a corrected version of the
	code example.
	
	Code Example
	------------
	
	The following is a corrected version of the SEEK program example taken
	from the QuickBASIC Version 4.50 QuickBASIC Advisor on-line Help
	system:
	
	'*** Programming example for the SEEK function and statement
	'
	CONST FALSE = 0, TRUE = NOT FALSE
	'  Define record fields.
	TYPE TestRecord
	   NameField  AS STRING * 20
	   ScoreField AS SINGLE
	END TYPE
	' Define a variable of the user type.
	DIM RecordVar AS TestRecord
	'********************************************************************
	' This part of the program is an insert whose only function is to
	' create a random-access file to be used by the second part of the
	' program, which demonstrates the CVSMBF function
	'********************************************************************
	OPEN "TESTDAT2.DAT" FOR RANDOM AS #1 LEN = LEN(RecordVar)
	'*************** above line has correction **************
	CLS
	RESTORE
	READ NameField$, ScoreField
	I = 0
	DO WHILE UCASE$(NameField$) <> "END"
	   I = I + 1
	   RecordVar.NameField = NameField$
	   RecordVar.ScoreField = ScoreField
	   PUT #1, I, RecordVar
	   READ NameField$, ScoreField
	   IF NameField$ = "END" THEN EXIT DO
	LOOP
	CLOSE #1
	'
	  DATA "John Simmons", 100
	  DATA "Allie Simpson", 95
	  DATA "Tom Tucker", 72
	  DATA "Walt Wagner", 90
	  DATA "Mel Zucker", 92
	  DATA "END", 0
	
	'  Open the test data file.
	'
	DIM FileBuffer AS TestRecord
	OPEN "TESTDAT2.DAT" FOR RANDOM AS #1 LEN = LEN(FileBuffer)
	'  Calculate number of records in the file.
	Max = LOF(1) / LEN(FileBuffer)
	'  Read and print contents of each record.
	FOR I = 1 TO Max
	   GET #1, I, FileBuffer
	   IF RTRIM$(FileBuffer.NameField) = "Tom Tucker" THEN
	'*************** above line has correction **************
	      ReWriteFlag = TRUE
	      EXIT FOR
	   END IF
	NEXT I
	'
	IF ReWriteFlag = TRUE THEN
	   ' Back up file by one record
	'*************** above line has correction **************
	   FileBuffer.ScoreField = 100
	   SEEK #1, SEEK(1) - 1
	'*************** above line has correction **************
	   PUT #1, , FileBuffer
	'*************** above line has correction **************
	END IF
	'
	CLOSE #1
	KILL "TESTDAT2.DAT"
	END
