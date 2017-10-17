---
layout: page
title: "Q41446: QB 2.x/3.00 Example to Load DOS Directory Listing into Array"
permalink: /pubs/pc/reference/microsoft/kb/Q41446/
---

## Q41446: QB 2.x/3.00 Example to Load DOS Directory Listing into Array

	Article: Q41446
	Version(s): 2.00 2.01 3.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 8-MAR-1989
	
	This article discusses methods to put a disk directory listing into a
	string array in QuickBASIC Version 2.00, 2.01, or 3.00. (This
	information was prepared because the FILES statement in QuickBASIC
	only outputs to the screen, and not to a file or variables.)
	
	Example 1 shows a simple method to SHELL to the DIR command, redirect
	the output to a file, and input from the file into string variables.
	
	Example 2 shows how to invoke MS-DOS operating-system functions to
	retrieve a disk directory into string variables. This example uses the
	CALL INT86 statement to invoke MS-DOS interrupt hex 21 with the
	following functions:
	
	   hex 1A (SetDTA)
	
	   hex 4E (FindFirst)
	
	   hex 4F (FindNext)
	
	This example of using CALL INT86 applies to Microsoft QuickBASIC
	Versions 2.00, 2.01, and 3.00. For instructions for later versions of
	QuickBASIC, please refer to a separate article in this KnowledgeBase
	by querying for the following keywords:
	
	   INTERRUPT and FINDFIRST and FINDNEXT
	
	Example 1 (the simplest technique) is as follows:
	
	' Works in QuickBASIC 2.00, 2.01, 3.00, 4.00, 4.00b, 4.50, and
	' BASIC Compiler 6.00 and 6.00b. Add line numbers to work in
	' GW-BASIC 3.20, 3.22, or 3.23.
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
	KILL "dirfile.dat"   ' Deletes the temporary file.
	END
	
	Example 2 is as follows:
	
	To use the DIRLIST.BAS program below in QuickBASIC Version 3.00, you
	must first make a User Library that contains INT86.OBJ, or else you
	can link DIRLIST.OBJ directly to INT86.OBJ. In QuickBASIC Versions
	2.00 and 2.01, you would use USERLIB.OBJ instead of INT86.OBJ in the
	two alternatives below. The following are the two choices:
	
	1. The following command makes USERLIB.EXE:
	
	      BUILDLIB INT86;
	
	   You can then invoke the QB.EXE editor with the /L option to
	   access the User Library that contains the INT86 routine:
	
	      QB DIRLIST.BAS /L USERLIB.EXE
	
	   When you choose the EXE output option in the Compile... window, the
	   resulting .EXE program requires the presence of USERLIB.EXE.
	
	2. You can compile and link as follows:
	
	      QB DIRLIST.BAS;
	      LINK DIRLIST.OBJ+INT86.OBJ;
	
	The following is the Source Code for DIRLIST.BAS:
	
	DIM InArray%(9), OutArray%(9)
	AX% = 0: DX% = 3: DS% = 8: CX% = 2  ' -- Register locations
	DTA$ = SPACE$(43)                   ' -- DTA Buffer size
	Path$ = "*.*" + CHR$(0)             ' -- Search path, plus null byte
	
	REM -- Find Segment and Offset for the DTA (Disk Transfer Area)
	CALL PTR86(Seg1%, Off1%, VARPTR(DTA$))
	
	REM -- The real Offset for the string DTA$ is found by using the
	REM    SADD function.
	Off1% = SADD(DTA$)
	
	REM -- Set the DTA with Interrupt Hex 21, and Function Hex 1A
	InArray%(AX%) = &H1A00
	InArray%(DX%) = Off1%
	InArray%(DS%) = Seg1%
	CALL INT86(&H21, VARPTR(InArray%(0)), VARPTR(OutArray%(0)))
	
	REM -- Find the Segment and Offset for the Search Path
	CALL PTR86(Seg1%, Off1%, VARPTR(Path$))
	
	REM -- Real Offset is found by using the SADD function
	Off1% = SADD(Path$)
	
	REM -- Find the first file with Interrupt Hex 21, Function Hex 4E
	InArray%(AX%) = &H4E00
	InArray%(CX%) = 22
	InArray%(DX%) = Off1%
	InArray%(DS%) = Seg1%
	CALL INT86(&H21, VARPTR(InArray%(0)), VARPTR(OutArray%(0)))
	
	REM -- Stay in while loop until
	REM    18 = No more files
	REM     3 = Invalid search path -OR- no files found
	WHILE (OutArray%(AX%) <> 18) AND (OutArray%(AX%) <> 3)
	   a% = CVI(MID$(DTA$, 27, 2))  ' -- Low word of file size
	   b% = CVI(MID$(DTA$, 29, 2))  ' -- High word of file size
	   IF a% < 0 THEN               ' -- Calculate size relative to
	      d! = 65536 + a%           '    Low word
	   ELSE
	      d! = a%
	   END IF
	   IF b% < 0 THEN               ' -- Calculate size with High word
	      d! = d! + (65536 * (65536 + b%))
	   ELSE
	      d! = d! + (65536 * b%)
	   END IF
	   PRINT RIGHT$(DTA$, 13);      ' -- Print file name
	   PRINT "  ";
	   PRINT d!                     '    and file size
	   MID$(DTA$, 31, 13) = SPACE$(13) ' -- Blank out current name
	   InArray%(AX%) = &H4F00       ' Function Hex 4F - Find Next File
	   CALL INT86(&H21, VARPTR(InArray%(0)), VARPTR(OutArray%(0)))
	WEND
	END
