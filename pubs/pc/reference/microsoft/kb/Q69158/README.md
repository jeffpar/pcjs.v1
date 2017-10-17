---
layout: page
title: "Q69158: ISAMCVT Doesn't Properly Convert db/LIB Date Fields"
permalink: /pubs/pc/reference/microsoft/kb/Q69158/
---

## Q69158: ISAMCVT Doesn't Properly Convert db/LIB Date Fields

	Article: Q69158
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S910116-88 buglist7.00 buglist7.10
	Last Modified: 11-FEB-1991
	
	Page 393 of the "Microsoft BASIC 7.0: Programmer's Guide" (for
	versions 7.00 and 7.10) states that the ISAMCVT utility will convert
	db/LIB date fields to BASIC double-precision numbers for use with the
	Date/Time add-on libraries.
	
	ISAMCVT does convert a date field to a double-precision number, but
	the resulting number is not a serial number that can be used with the
	date libraries included with BASIC.
	
	Microsoft has confirmed this to be a problem with the ISAMCVT.EXE
	utility for Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS. We are researching this problem and
	will post new information here as it becomes available.
	
	When ISAMCVT converts a date field, it converts it to a 8-byte string,
	but tags it internally as a double. To see the string, you must use
	the MKD$ function to convert the double to a string.
	
	However, ISAMCVT also converts the year portion of the date
	incorrectly by dropping the last two digits (for example, 1990 becomes
	19, and 1890 becomes 18.)
	
	For example, if you have a db/LIB file ("test.dbf") containing
	three fields and one record
	
	   NUMERIC (length=4, # decimals=1)   = 1.2
	   CHARACTER (length = 50)            = My Name
	   DATE                               = 19901214
	
	and then you converted it using
	
	   ISAMCVT /D test.dbf table test.mdb
	
	the program below will then show that the ISAM file contains the
	following:
	
	    CustNum = 1.2
	    Name    = My Name
	    Date    = 12/14/19
	
	Code Sample
	-----------
	
	Note: PROISAM.EXE must be loaded before running this program inside of
	QBX.EXE.
	
	TYPE rectype
	    CustNum AS DOUBLE
	    Name AS STRING * 50
	    Date AS DOUBLE
	END TYPE
	DIM a AS rectype
	OPEN "test.mdb" FOR ISAM rectype "table" AS #1
	SETINDEX #1, ""
	MOVEFIRST #1
	RETRIEVE #1, a
	PRINT a.CustNum
	PRINT a.Name
	PRINT MKD$(a.Date)
	CLOSE #1
