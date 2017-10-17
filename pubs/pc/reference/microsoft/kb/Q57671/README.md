---
layout: page
title: "Q57671: Using DIR&#36; to Load Directory Listing into Array in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q57671/
---

## Q57671: Using DIR&#36; to Load Directory Listing into Array in BASIC 7.00

	Article: Q57671
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1990
	
	This article illustrates how to use the DIR$ function and load an
	MS-DOS or MS OS/2 directory listing into a BASIC string array. This
	information applies only to the Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The following sample program demonstrates use of the DIR$ function
	available in BASIC PDS 7.00 to return all the files matching a given
	filespec and store them in a BASIC string array. For more information
	on the DIR$ function, see Page 107 of the "Microsoft BASIC 7.0:
	Language Reference" manual.
	
	Code Example
	------------
	
	DEFINT A-Z
	CONST TRUE = -1
	CONST FALSE = NOT TRUE
	
	NumFiles = 255             'Maximum number of filenames to hold
	Counter = 0
	Finished = FALSE
	DIM FileName$(NumFiles)
	
	CLS     'Enter DIR type filespec, for example "C:\*.BAS":
	INPUT "Enter filespec:"; Path$
	
	TempName$ = DIR$(Path$)             'Get the first filename.
	IF TempName$ = "" THEN
	  PRINT "No file(s) found"
	ELSE
	  FileName$(Counter) = TempName$ ' Keep getting filenames until we
	  Counter = Counter + 1      ' have NumFiles worth or we get them all.
	  DO
	    TempName$ = DIR$
	    IF TempName$ <> "" THEN FileName$(Counter) = TempName$
	    Counter = Counter + 1
	  LOOP WHILE TempName$ <> "" AND Counter <= NumFiles
	END IF
	
	IF FileName$(0) <> "" THEN    'Display filenames if we received any.
	  Counter = 0
	  DO
	    PRINT FileName$(Counter)
	    IF FileName$(Counter) = "" THEN Finished = TRUE
	    Counter = Counter + 1
	  LOOP WHILE Counter <= NumFiles AND NOT Finished
	END IF
