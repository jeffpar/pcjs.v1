---
layout: page
title: "Q58791: DATEVALUE# Function in BASIC 7.00 Uses MM-DD-YY, Not DD-MM-YY"
permalink: /pubs/pc/reference/microsoft/kb/Q58791/
---

## Q58791: DATEVALUE# Function in BASIC 7.00 Uses MM-DD-YY, Not DD-MM-YY

	Article: Q58791
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 8-JAN-1991
	
	The DATEVALUE# function that comes in the Date/Time Library of
	Microsoft BASIC Professional Development System (PDS) Version 7.00
	does not interpret dates in the form of "dd/mm/yy" or "dd-mm-yy,"
	where the day number precedes the month number (dd stands for day, mm
	stands for month, and yy stands for year). Instead, the DATEVALUE#
	function interprets dates in the form of "mm/dd/yy" or "mm-dd-yy,"
	where the month number precedes the day number. For example, you get
	"Illegal Function Call" (error 5) when passing "30/12/88" or
	"30-12-88" to the DATEVALUE# function.
	
	Both Page 427 of the "Microsoft BASIC 7.0: Language Reference" manual
	(for 7.00 and 7.10) and also the "HELP: DateValue# Function Details"
	screen in the Microsoft Advisor online Help system in QBX.EXE
	incorrectly state that "30/12/88" is one of the acceptable formats.
	This should be changed to say that "12/30/88" ("mm/dd/yy") format is
	accepted by the DATEVALUE# function.
	
	Also, the "HELP: DateValue# Function Details" screen in the Microsoft
	Advisor online Help system in QBX.EXE incorrectly states: "To use
	DateValue# in the QBX environment, use the FINANCER.QLB Quick
	library." This should be changed to say the DTFMTER.QLB Quick library.
	(Page 427 of the reference manual correctly says to use DTFMTER.QLB in
	QBX.)
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	If you want to give the date before the month, you can use the name of
	the month instead of the numeric representation of the month.
	
	The following are not accepted ("Illegal Function Call"):
	
	   B# = DateValue# ("30-12-88")
	   B# = DateValue# ("30/12/88")
	
	The following are accepted (the workaround is to use the spelled
	instead of the numeric month):
	
	   B# = DateValue# ("30-Dec-88")
	   B# = DateValue# ("30/Dec/88")
	
	The following are accepted (but month, day, and year must be in
	order):
	
	   B# = DateValue# ("12-30-88")
	   B# = DateValue# ("12/30/88")
	   B# = DateValue# ("December 30, 1988")
	
	DateValue# accepts dates between January 1, 1753, and December 31,
	2078.
	
	Complete Code Example
	---------------------
	
	You can run this program with QBX /L DTFMTER.QLB, or link with the
	appropriate DTFMTxx.LIB file if making an .EXE program:
	
	   REM $INCLUDE: 'DATIM.BI'
	   d$ = "30-Dec-88"
	   PRINT DateValue#(d$)   ' Prints 32507
	   d$ = "12/30/88"
	   PRINT DateValue#(d$)   ' Prints 32507
