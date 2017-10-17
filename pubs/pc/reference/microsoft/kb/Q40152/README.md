---
layout: page
title: "Q40152: How to Incorporate Paintbrush (PCX) EGA File into QB SCREEN 9"
permalink: /pubs/pc/reference/microsoft/kb/Q40152/
---

## Q40152: How to Incorporate Paintbrush (PCX) EGA File into QB SCREEN 9

	Article: Q40152
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881229-80
	Last Modified: 12-DEC-1989
	
	Microsoft QuickBASIC can incorporate PCX files created with the
	Microsoft Mouse Paintbrush package through the use of the FRIEZE
	terminate-and-stay-resident (TSR) program. The FRIEZE TSR is included
	in the Microsoft Mouse Paintbrush package and can be loaded up into
	memory by running the PAINT.BAT file located on the Microsoft Mouse
	Utilities distribution disk. The steps you should first take are as
	follows:
	
	1. Load the FRIEZE TSR into memory from within a batch file.
	
	2. Load your QuickBASIC program, which will issue an interrupt 5. This
	   makes the TSR active, allowing you to load a PCX file from disk
	   into the video-card memory.
	
	Your QuickBASIC program then can BSAVE the four EGA planes--red,
	green, blue, and intensity--out to disk. This makes it possible to
	include high quality, color pictures in QuickBASIC programs.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS and Microsoft BASIC Compiler Versions 6.00 and
	6.00b and Microsoft BASIC PDS 7.00 for MS-DOS and MS OS/2.
	
	The following is a code example:
	
	+++++++++++++++++++++++++++++++++++
	EGAPBSAV.BAS
	+++++++++++++++++++++++++++++++++++
	
	REM If you are using BASIC PDS 7.00, change the include file
	REM below to 'QBX.BI'.
	
	REM $INCLUDE: 'QB.BI'
	DIM REGS AS RegType
	DIM SHARED TOTALVIDEOMEM AS INTEGER
	DIM SHARED FILNAME$
	
	TOTALVIDEOMEM=28000
	SCREEN 9
	COLOR 5,0
	CLS
	PRINT "MAKE SURE THAT YOU HAVE LOADED THE FRIEZE TSR INTO MEMORY BEFORE"
	PRINT "RUNNING THIS PROGRAM."
	PRINT
	CALL SAVEPCXFILE
	END
	
	SUB SAVEPCXFILE STATIC
	  DIM REGS AS REGTYPE
	  PRINT : PRINT
	  PRINT "WHAT BASE NAME WOULD YOU LIKE TO GIVE THE BINARY IMAGE FILE?"
	  PRINT "PLEASE DO NOT PROVIDE AN EXTENSION (e.g. .BAS OR .BIN)"
	  PRINT
	  INPUT "FILENAME: ",FILENAME$
	  PRINT "PRESS ANY KEY TO BRING UP THE FRIEZE TSR...."
	  SLEEP
	  CALL INTERRUPT(&H5,REGS,REGS)
	  DEF SEG=&HA000
	  FOR I=0 TO 3
	        'SET EGA REGISTER FOR A READ FROM EACH PLANE
	        OUT &H3CE,4
	        OUT &H3CF,I
	        TEMP$=RTRIM$(FILENAME$)+LTRIM$(STR$(I))+".EGA"
	        BSAVE TEMP$,0,TOTALVIDEOMEM
	  NEXT I
	  DEF SEG
	END SUB
