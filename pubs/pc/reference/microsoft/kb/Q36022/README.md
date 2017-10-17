---
layout: page
title: "Q36022: How to BSAVE/BLOAD EGA SCREENs 7, 8, 9, 10 in QB 2.x, 3.0, 4.x"
permalink: /pubs/pc/reference/microsoft/kb/Q36022/
---

## Q36022: How to BSAVE/BLOAD EGA SCREENs 7, 8, 9, 10 in QB 2.x, 3.0, 4.x

	Article: Q36022
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-DEC-1989
	
	Below is a code example that uses BSAVE and BLOAD to store and
	retrieve a screen image in EGA SCREEN modes 7, 8, 9, and 10 to and
	from disk. This BSAVE and BLOAD technique required for EGA screens is
	not as straightforward as for CGA or Hercules SCREEN modes, since EGA
	memory is stored in discontinuous color planes.
	
	The code example further below works in the following products:
	
	1. Microsoft QuickBASIC Versions 3.00, 4.00, 4.00b, and 4.50
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   Microsoft BASIC PDS Version 7.00 for MS-DOS
	   (Note that EGA SCREENs are not supported in the protected mode of
	   OS/2.)
	
	QuickBASIC Versions 2.00 and 2.10 do not support SELECT CASE, and the
	program below needs to be modified to use IF statements instead.
	
	QuickBASIC Versions 1.00, 1.01, and 1.02 do not support the EGA SCREEN
	modes (7, 8, 9, and 10), and cannot use this program.
	
	This program can also be found in the May 12, 1987 issue of "PC
	Magazine" on Pages 403-404.
	
	For an example of BLOAD and BSAVE of VGA screen modes (11, 12, and 13)
	(for QuickBASIC 4.x and the BASIC compiler 6.00 and 6.00b and BASIC
	PDS 7.00) in addition to EGA modes, query on the word BSAVEVGA for a
	separate article in this database.
	
	The EGA memory is broken into color planes. The program below is
	designed to save a given EGA screen into separate disk files: one file
	for each EGA color plane.
	
	For more technical information about EGA memory, please refer to the
	following book, which is available from bookstores or from Microsoft
	Press by calling (800) 638-3030 or (206) 882-8080:
	
	   "Programmer's Guide to PC and PS/2 Video Systems," by Richard
	   Wilton. Published by Microsoft Press (1987).
	
	Code Example
	------------
	
	' HOW TO BLOAD AND BSAVE EGA SCREENS 7, 8, 9, and 10.
	SCREEN 9  ' Invokes EGA 640 x 350 16-color mode.
	FOR i = i TO 200  '  Draw some random lines in random colors:
	x1 = INT(640 * RND)
	y1 = INT(350 * RND)
	x2 = INT(640 * RND)
	y2 = INT(350 * RND)
	co = INT(15 * RND)
	LINE (x1, y1)-(x2, y2), co
	NEXT i
	
	' Save EGA video memory from video memory to disk:
	filename$ = "TEST"
	mode = 9
	RW = 0
	CALL EGA(filename$, mode, RW)
	CLS
	INPUT "Hit <ENTER> to restore screen:", a$
	
	'Load EGA video memory from disk to video memory:
	RW = 1
	CALL EGA(filename$, mode, RW)
	END
	
	SUB EGA (filename$, mode, RW) STATIC
	' filename$=filename
	' mode=video mode (EGA SCREEN number)
	' RW=read/write EGA from/to disk R=T, W=F
	
	'Determine amount of video memory for display mode:
	SELECT CASE mode
	CASE 7
	  Total = 8000
	CASE 8
	  Total = 16000
	CASE 9 TO 10
	  Total = 28000
	CASE ELSE
	  PRINT "ERROR: NonEGA Graphics Mode!"
	  GOTO NOEGA
	END SELECT
	
	'Cycle through each video plane of EGA
	IF mode = 10 THEN cycle = 1 ELSE cycle = 3
	DEF SEG = &HA000    ' Segment of EGA video memory
	FOR i = 0 TO cycle
	  IF RW = 1 THEN
	    ' Set EGA register for write to each plane:
	    OUT &H3C4, 2
	    OUT &H3C5, 2 ^ i
	
	    F$ = filename$ + CHR$(i + 48) + ".EGA"
	    BLOAD F$, 0
	  ELSE
	    ' Set EGA register for read from each plane:
	    OUT &H3CE, 4
	    OUT &H3CF, i
	    F$ = filename$ + CHR$(i + 48) + ".EGA"
	    BSAVE F$, 0, Total
	  END IF
	NEXT i
	DEF SEG
	NOEGA:
	END SUB
