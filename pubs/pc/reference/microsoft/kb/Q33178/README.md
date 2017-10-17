---
layout: page
title: "Q33178: Example to Load OS/2 Disk Directory into String Array"
permalink: /pubs/pc/reference/microsoft/kb/Q33178/
---

## Q33178: Example to Load OS/2 Disk Directory into String Array

	Article: Q33178
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	This article discusses two methods to put a disk directory listing
	into a string array under OS/2 protected mode. (Note: This article was
	written because the FILES statement in BASIC only outputs to the
	screen, not to a file or to string variables.)
	
	Example 1 shows a simple method to SHELL to the DIR command, redirect
	the output to a file, and input from the file into string variables.
	(Example 1 also works correctly in MS-DOS.)
	
	Example 2 shows how to invoke OS/2 API functions (DosFindFirst and
	DosFindNext) to retrieve a disk directory into string variables.
	
	This article applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Note: In Microsoft BASIC PDS 7.00, the DIR$ function can be used to
	accomplish the same thing as these two routines show. The use of DIR$
	is documented on Page 107 of the "Microsoft BASIC 7.0: Language
	Reference" manual.
	
	For an article about how to invoke MS-DOS (or OS/2 real mode)
	functions to accomplish the same thing, query in this Knowledge Base
	on the following keywords:
	
	   INTERRUPT and FINDFIRST and FINDNEXT
	
	In MS OS/2 protected mode, you can use the API CALLs DosFindFirst and
	DosFindNext to retrieve a disk directory listing and load it into a
	string array, as shown in Example 2 below. Example 2 does NOT apply to
	QuickBASIC Versions 4.50 and earlier because they cannot compile
	programs for OS/2 protected mode.
	
	Example 1 (the simplest technique) is as follows:
	
	' Works in QuickBASIC 2.00, 2.01, 3.00, 4.00, 4.00b, 4.50, and
	' BASIC compiler 6.00 and 6.00b.
	nf = 200   ' Handles directory listing up to 200 lines.
	DIM buffer$(nf)
	INPUT "Enter Search Path: ", path$   ' Enter path such as c:
	SHELLSTRING$ = "dir " + path$ + " >dirfile.dat"
	SHELL SHELLSTRING$   ' SHELL to the MS-DOS DIRectory command.
	OPEN "dirfile.dat" FOR INPUT AS #1
	pntr% = 0
	WHILE NOT EOF(1) AND pntr% < nf
	  pntr% = pntr% + 1
	  INPUT #1, buffer$(pntr%)  ' Inputs one directory line at a time.
	  PRINT buffer$(pntr%)
	WEND
	CLOSE #1
	KILL "dirfile.dat"
	END
	
	Example 2 is as follows:
	
	The following sample program is for MS OS/2 protected mode (to be
	compiled only in BASIC compiler Version 6.00 or 6.00b in MS OS/2
	protected mode or BASIC PDS Version 7.00 in MS OS/2 protected mode):
	
	'The TYPE below is taken from the following include file: BSEDOSFL.BI
	TYPE FILEFINDBUF
	        fdateCreation   AS INTEGER
	        ftimeCreation   AS INTEGER
	        fdateLastAccess AS INTEGER
	        ftimeLastAccess AS INTEGER
	        fdateLastWrite  AS INTEGER
	        ftimeLastWrite  AS INTEGER
	        cbFile          AS LONG
	        cbFileAlloc     AS LONG
	        attrFile        AS INTEGER
	        cchName         AS STRING * 1
	        achName         AS STRING * 13
	END TYPE
	
	DECLARE FUNCTION DosFindFirst%( _
	        BYVAL P1s AS INTEGER,_
	        BYVAL P1o AS INTEGER,_
	        SEG   P2  AS INTEGER,_
	        BYVAL P3  AS INTEGER,_
	        SEG   P4  AS FILEFINDBUF,_
	        BYVAL P5  AS INTEGER,_
	        SEG   P6  AS INTEGER,_
	        BYVAL P7  AS LONG)
	
	DECLARE FUNCTION DosFindNext%( _
	        BYVAL P1 AS INTEGER,_
	        SEG   P2 AS FILEFINDBUF,_
	        BYVAL P3 AS INTEGER,_
	        SEG   P4 AS INTEGER)
	
	DEFINT a-z
	
	DIM buffer AS FileFindBuf
	DIM filelist(255) as string*13
	DIM reserved  AS LONG
	
	CLS
	
	INPUT "Enter the Filename(s) : ";flname$
	flname$=flname$+chr$(0)
	
	atr= 0+2+4+16    'normal + hidden + system + subdirectory
	dirh=1
	searchcount=1
	bufflen=36
	x=DosFindFirst%(varseg(flname$),sadd(flname$),_
	                dirh,atr,buffer,bufflen,searchcount,reserved)
	IF (X=0) THEN
	   DO
	     counter=counter+1
	     filelist(counter)=buffer.achName
	     buffer.achName=string$(13,32)  'assign blanks
	   LOOP WHILE (DosFindNext%(dirh,buffer,bufflen,searchcount) = 0 )
	ELSE
	    PRINT "No MATCH was found"
	    END
	END IF
	
	for i = 1 to counter
	    print filelist(i)
	next i
	
	END
