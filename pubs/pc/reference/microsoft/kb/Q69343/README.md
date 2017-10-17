---
layout: page
title: "Q69343: ISAMCVT Btrieve Specfiles Cannot Have Spaces; Must Use Commas"
permalink: /pubs/pc/reference/microsoft/kb/Q69343/
---

## Q69343: ISAMCVT Btrieve Specfiles Cannot Have Spaces; Must Use Commas

	Article: Q69343
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S910205-152
	Last Modified: 14-FEB-1991
	
	Page 392 of the "Microsoft BASIC 7.0: Programmer's Guide" (for BASIC
	PDS 7.00 and 7.10) gives an incorrect example of a Btrieve specfile.
	The fields of each entry are incorrectly shown separated by spaces;
	instead, the fields should be separated by commas.
	
	ISAMCVT specfiles must not contain spaces.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS.
	
	The specfile on page 392 should be changed to the following:
	
	   string,4,StringCol
	   integer,2,IntColumn
	   Long,10,LongColumn
	   Double,5,DoubleCol
	
	If ISAMCVT is run with this specfile and an appropriate Btrieve file,
	the Btrieve file will be successfully converted. Note that the
	specfile must specify the format for every column in the Btrieve file
	(for both indexes and non-indexes).
	
	Page 392 gives the following incorrect example of a Btrieve specfile:
	
	   string 4 StringCol
	   integer 2 IntColumn
	   Long 10 LongColumn
	   Double 5 DoubleCol
	
	ISAMCVT gives the following error message when using the above
	specfile:
	
	   ISAMCVT: Invalid data type 'string 4 StringCol
	   ' in line 1 of <specfilename>.
	
	ISAMCVT does not allow spaces as field separators. It is also illegal
	to mix commas and spaces as in the next example:
	
	   string, 4, StringCol
	   integer, 2, IntColumn
	   Long, 10, LongColumn
	   Double, 5, DoubleCol
	
	ISAMCVT gives the following error message when using the above
	specfile:
	
	   ISAMCVT: Missing or invalid column name in line 1 of <specfilename>
	
	The fields of an ISAMCVT specfile must be separated by commas and no
	spaces should be in the file.
	
	
	
	
	
	
	Microsoft QuickBASIC
	=============================================================================
