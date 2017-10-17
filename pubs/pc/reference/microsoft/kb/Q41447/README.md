---
layout: page
title: "Q41447: QB 4.x Example to Load MS-DOS Directory Listing into an Array"
permalink: /pubs/pc/reference/microsoft/kb/Q41447/
---

## Q41447: QB 4.x Example to Load MS-DOS Directory Listing into an Array

	Article: Q41447
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-JAN-1991
	
	This article discusses three methods to put an MS-DOS disk directory
	listing into a string array. This article applies to Microsoft
	QuickBASIC versions 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS-DOS, and to Microsoft
	BASIC Professional Development System (PDS) versions 7.00 and 7.10 for
	MS-DOS and MS OS/2.
	
	Example 1 shows a simple method to SHELL to the MS-DOS DIR command,
	redirect the output to a file, and input from the file into string
	variables.
	
	Example 2 shows how to use the CALL INTERRUPT routine to invoke MS-DOS
	function calls (SetDTA, FindFirst, and FindNext) to retrieve a disk
	directory into string variables in a compiled BASIC program.
	
	A third method is to use the DIR$ function introduced in Microsoft
	BASIC PDS version 7.00/7.10 for MS-DOS and MS OS/2. For an example of
	using the DIR$ function (which works both in MS-DOS and MS OS/2),
	search for a separate article by querying on the following words:
	
	   7.00 and "DIR$" and DIRECTORY and LISTING
	
	For an example of calling the MS-DOS interrupt functions to obtain
	disk directory information in QuickBASIC Version 2.00, 2.01, or 3.00,
	query on the following words:
	
	   INT86.OBJ and FINDFIRST
	
	For a Microsoft BASIC PDS 7.00 or 7.10 or BASIC compiler version 6.00
	or 6.00b example that displays directory information in MS OS/2
	protected mode, query on the following words:
	
	   DosFindFirst or DosFindNext
	
	Example 1 (a technique simpler than the next example)
	---------
	
	' Works in QuickBASIC 2.00, 2.01, 3.00, 4.00, 4.00b, 4.50, and
	' Microsoft BASIC Compiler 6.00 and 6.00b, and BASIC PDS 7.00, 7.10
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
	
	Example 2
	---------
	
	Example 2 below shows how to load an MS-DOS disk directory listing
	into a string array, using the CALL INTERRUPT statement to invoke the
	MS-DOS operating-system interrupt 21 hex, with functions 1A hex
	(SetDTA), 4E hex (FindFirst), and 4F hex (FindNext). Example 2 below
	applies to QuickBASIC versions 4.00, 4.00b, and 4.50 and Microsoft
	BASIC Compiler versions 6.00 and 6.00b running under MS-DOS (or OS/2
	real mode, which emulates DOS versions 3.x).
	
	To make this example work in BASIC PDS 7.00, modify the Firstfm
	FUNCTION in the example further below as follows:
	
	1. DIM inreg AS RegTypex and outreg AS RegTypex
	2. Change CALL INTERRUPT to CALL INTERRUPTX
	3. Add the following line in between the assignment for inreg.dx and
	   the CALL INTERRUPTX:    inreg.ds = SSEG(FileName$)
	
	REM  DIR.BAS
	'$INCLUDE: 'QB.BI'      '<-- look at what is in this file
	'  QB.BI contains the TYPE definitions for "Outreg" and "Inreg"
	'  and the declarations for both INTERRUPT and INTERRUPTX.
	TYPE FileFindBuf
	      dos            AS STRING * 21
	      Attributes     AS STRING * 1
	      CreateTime     AS INTEGER
	      AccessDate     AS INTEGER
	      FileSize       AS LONG
	      FileName       AS STRING * 13
	END TYPE
	TYPE FileInfo
	      FileName       AS STRING * 13
	      Size           AS STRING * 8
	      Seconds        AS STRING * 4
	      Minutes        AS STRING * 4
	      Hours          AS STRING * 4
	      Day            AS STRING * 4
	      Month          AS STRING * 4
	      Year           AS STRING * 5
	END TYPE
	DIM BUFFER AS FileFindBuf
	DIM FileInfoBlock(100) AS FileInfo
	DECLARE SUB intbuf (BUFFER AS FileFindBuf)
	DECLARE SUB setdta (BUFFER AS FileFindBuf)
	DECLARE FUNCTION firstfm! (path$, fa%)
	DECLARE FUNCTION nextfm ()
	DECLARE SUB CalculateAssign (FileInfoBlock() AS ANY, BUFFER AS ANY,_
	                             counter!)
	DECLARE SUB PrintDirList (FileInfoBlock() AS ANY, i!)
	CLS : CALL setdta(BUFFER)
	INPUT "Enter the files spec: "; path$
	fa% = 0  ' A value of 16 includes directory names.
	counter = 0
	IF (firstfm(path$, fa%) = 0) THEN
	  DO
	   counter = counter + 1
	   CalculateAssign FileInfoBlock(), BUFFER, counter
	   CALL setdta(BUFFER)
	  LOOP WHILE (nextfm = 0)
	END IF
	CLS
	FOR i = 1 TO counter
	   PrintDirList FileInfoBlock(), i
	NEXT i
	END
	
	SUB CalculateAssign (FileInfoBlock() AS FileInfo, _
	                     BUFFER AS FileFindBuf, counter)
	   FileInfoBlock(counter).FileName = BUFFER.FileName
	   FileInfoBlock(counter).Size = STR$(BUFFER.FileSize)
	   FileInfoBlock(counter).Seconds = STR$(BUFFER.CreateTime AND &H1F)
	   FileInfoBlock(counter).Minutes = _
	              STR$((BUFFER.CreateTime AND &H7E0) \ 32)
	   'If BUFFER.CreateTime is negative add 64K to make unsigned integer:
	   IF BUFFER.CreateTime < 0 THEN
	     FileInfoBlock(counter).Hours = _
	              STR$(((BUFFER.CreateTime + 2 ^ 16) AND &HF800) \ 2048)
	   ELSE
	     FileInfoBlock(counter).Hours = _
	              STR$((BUFFER.CreateTime AND &HF800) \ 2048)
	   END IF
	   FileInfoBlock(counter).Day = STR$(BUFFER.AccessDate AND &H1F)
	   FileInfoBlock(counter).Month = _
	              STR$((BUFFER.AccessDate \ 32) AND &HF)
	   FileInfoBlock(counter).Year = _
	              STR$((BUFFER.AccessDate \ 512) + 1980)
	END SUB
	
	FUNCTION firstfm (path$, fa%)
	  DIM inreg AS regtype, outreg AS regtype '1. Use regtypex for BASIC 7.00
	  inreg.ax = &H4E00
	  inreg.cx = fa%
	  FileName$ = path$ + CHR$(0)
	  inreg.dx = SADD(FileName$)
	' 2. Add this here for BASIC 7.00:  inreg.ds=SSEG(FileName$)
	  CALL INTERRUPT (&H21, inreg, outreg) '3. Use INTERRUPTX in BASIC 7.00
	  firstfm = (outreg.ax AND &HF)
	END FUNCTION
	
	SUB intbuf (BUFFER AS FileFindBuf) STATIC
	' The first 20 bytes are reserved for DOS and are unchanged
	    BUFFER.CreateTime = 0
	    BUFFER.Attributes = " "
	    BUFFER.AccessDate = 0
	    BUFFER.FileSize = 0
	    BUFFER.FileName = STRING$(13, 32)
	END SUB
	
	FUNCTION nextfm
	  DIM inreg AS regtype, outreg AS regtype
	  inreg.ax = &H4F00
	  CALL interrupt(&H21, inreg, outreg)
	  nextfm = outreg.ax AND &HF
	END FUNCTION
	
	SUB PrintDirList (FileInfoBlock() AS FileInfo, i)
	  PRINT FileInfoBlock(i).FileName;
	  PRINT TAB(15); FileInfoBlock(i).Size;
	  PRINT TAB(25); RTRIM$(LTRIM$(FileInfoBlock(i).Month)) + "-";
	  IF LEN(RTRIM$(LTRIM$(FileInfoBlock(i).Day))) = 1 THEN
	    FileInfoBlock(i).Day = "0" + LTRIM$(FileInfoBlock(i).Day)
	  END IF
	  PRINT RTRIM$(LTRIM$(FileInfoBlock(i).Day)) + "-";
	  PRINT RTRIM$(LTRIM$(FileInfoBlock(i).Year));
	  IF VAL(FileInfoBlock(i).Hours) = 0 THEN
	    FileInfoBlock(i).Hours = STR$(12) 'Change midnight from 0 to 12.
	  END IF
	  IF VAL(FileInfoBlock(i).Hours) > 12 THEN
	    x% = VAL(FileInfoBlock(i).Hours) - 12
	    FileInfoBlock(i).Hours = STR$(x%)
	    suffix$ = "p"
	  ELSE
	    suffix$ = "a"
	  END IF
	  IF VAL(FileInfoBlock(i).Hours) = 12 AND _
	             VAL(FileInfoBlock(i).Minutes) > 0 THEN suffix$ = "p"
	  IF LEN(RTRIM$(LTRIM$(FileInfoBlock(i).Hours))) = 1 THEN
	    t% = 39
	  ELSE
	    t% = 38
	  END IF
	  PRINT TAB(t%); RTRIM$(LTRIM$(FileInfoBlock(i).Hours)) + ":";
	  IF LEN(RTRIM$(LTRIM$(FileInfoBlock(i).Minutes))) = 1 THEN
	    FileInfoBlock(i).Minutes = "0" + LTRIM$(FileInfoBlock(i).Minutes)
	  END IF
	  PRINT RTRIM$(LTRIM$(FileInfoBlock(i).Minutes));
	  PRINT suffix$
	END SUB
	
	SUB setdta (BUFFER AS FileFindBuf) STATIC
	  DIM inreg AS regtypex, outreg AS regtypex
	  CALL intbuf(BUFFER)
	  inreg.ax = &H1A00
	  inreg.ds = VARSEG(BUFFER)
	  inreg.dx = VARPTR(BUFFER)
	  CALL interruptx(&H21, inreg, outreg)
	END SUB
