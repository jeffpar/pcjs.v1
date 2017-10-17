---
layout: page
title: "Q43526: Assigning Values by PMAP to INTEGERs Can Map Incorrectly"
permalink: /pubs/pc/reference/microsoft/kb/Q43526/
---

## Q43526: Assigning Values by PMAP to INTEGERs Can Map Incorrectly

	Article: Q43526
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890406-58 B_BasicCom
	Last Modified: 14-DEC-1989
	
	The PMAP FUNCTION can be used to map physical VIEW port coordinates to
	WINDOW coordinates, or WINDOW coordinates to VIEW port coordinates.
	When mapping physical coordinates of a VIEW port to the WINDOW
	coordinates, to ensure that correct results are obtained for all
	WINDOW coordinates, the value returned by PMAP should be assigned to a
	SINGLE or DOUBLE PRECISION variable. If assigned to an INTEGER
	variable, incorrect values can result, depending on the WINDOW
	coordinates assigned to the VIEW port.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	OS/2, and Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	When a VIEW port is defined, the physical coordinates refer to the
	actual SCREEN coordinates that are contained within the VIEW port. The
	following is a two-step illustration:
	
	1. SCREEN mode 2 has a resolution of 640 x 200. The physical
	   coordinates of a VIEW port defined as "VIEW (20, 20) - (40, 40)"
	   are 0 to 20 for both X and Y values. A "PSET(10, 10)" would turn on
	   the pixel at VIEW port coordinates (10,10), which correspond to
	   actual SCREEN coordinates of (30,30).
	
	2. If a WINDOW function is now performed, e.g. WINDOW (0, 0) - (10,
	   10), the physical coordinates remain the same, but a "PSET(10, 10)"
	   would turn on the pixel at VIEW port coordinates (20, 20), which
	   correspond to actual screen coordinates of (40, 40).
	
	The problem occurs when a WINDOW statement defines coordinates for a
	VIEW port for which each of the physical coordinates do not map to
	"WHOLE NUMBER" coordinates. The following is an illustration:
	
	SCREEN 2
	VIEW (5, 0) - (10, 5)         'Defines a 6 x 6 VIEW port with
	                              'physical coordinates of (0,0) to (5,5)
	WINDOW SCREEN (0,0)-(1,1)  'SCREEN places (0,0) at upper-left corner
	
	The coordinates from the above three lines of code would map to each
	other as follows:
	
	SCREEN X-Coordinates:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
	VIEW X-Coordinates:                   0  1  2  3  4  5
	WINDOW X-Coordinates:                 0 .2 .4 .6 .8  1
	
	Using the above chart:   VIEW Coordinates   WINDOW Coordinates
	                         ----------------   ------------------
	
	                                0      maps to      0
	                                1      maps to     .2
	                                2      maps to     .4
	             PMAP(Xview, 3)     3      maps to     .6
	                                4      maps to     .8
	                                5      maps to      1
	
	                         WINDOW Coordinates   VIEW Coordinates
	                         ------------------   ----------------
	
	                                0      maps to      0
	                               .2      maps to      1
	           PMAP(Xwindow, 1)    .4      maps to      2
	                               .6      maps to      3
	                               .8      maps to      4
	                                1      maps to      5
	
	IF the value of PMAP(Xview, 3) is assigned to a SINGLE or DOUBLE
	precision variable, the correct value is obtained:
	
	   Xmap! = PMAP(1, 3)     'Xmap! would equal .2
	
	If the value of PMAP(Xview, 3) is assigned to an INTEGER, a correct
	value is returned, but the INTEGER variable rounds the returned value
	up or down to the nearest INTEGER value, thus giving an incorrect
	mapping:
	
	   Xmap% = PMAP(1, 3)     'Xmap% would equal 0, when the correct
	                          'mapped value is .2 as shown above
	
	Code Example
	------------
	
	The following program demonstrates the potential problem. It defines a
	VIEW port of 21 x 21 at SCREEN coordinates of (20, 20) to (40, 40),
	and then defines WINDOW coordinates of (0, 0) to (10, 10), which
	demonstrates a situation where INTEGERS won't work. The window is then
	redefined using WINDOW coordinates of (0, 0) to (20, 20), which
	demonstrates a situation where INTEGERS will work:
	
	SCREEN 2
	VIEW (20, 20)-(40, 40)
	FOR n% = 1 TO 2
	  wxy% = n% * 10
	  WINDOW SCREEN (0, 0)-(wxy%, wxy%)
	
	  PRINT "VIEW (20, 20)-(40, 40)             YmapReal = PMAP(I%,3)"
	  PRINT "WINDOW SCREEN (0, 0)-("; wxy%; ","; wxy%; ")   YmapInt% =
	  PMAP(I%,3)"
	  PRINT
	  PRINT "I%     PMAP(YmapReal, 1)    PMAP(YmapInt%, 1)"
	
	  FOR I% = 0 TO 9
	
	    Ymapreal = PMAP(I%, 3)    'Maps I% to VIEW coordinates, assigns to
	                              'REAL
	    YmapInt% = PMAP(I%, 3)    'Maps I% to VIEW coordinates, assigns to
	                              'INTEGER
	
	    RemapFromReal = PMAP(Ymapreal, 1)  'Remaps Back to Physical
	                                       'coordinates
	    RemapFromInt = PMAP(YmapInt%, 1)   'and should be equal to I%
	
	    PRINT I%, RemapFromReal;
	
	    IF RemapFromReal <> RemapFromInt THEN
	        PRINT " <- NOT EQUAL -> ";
	      ELSE
	        PRINT "                 ";
	    END IF
	
	    PRINT RemapFromInt
	
	  NEXT I%
	  PRINT
	NEXT n%
	END
	
	*********** PROGRAM OUTPUT **********
	
	VIEW (20, 20)-(40, 40)             YmapReal = PMAP(I%,3)
	WINDOW SCREEN (0, 0)-( 10 , 10 )   YmapInt% = PMAP(I%,3)
	
	I%     PMAP(YmapReal, 1)    PMAP(YmapInt%, 1)
	 0             0                   0
	 1             1  <- NOT EQUAL ->  0
	 2             2                   2
	 3             3  <- NOT EQUAL ->  4
	 4             4                   4
	 5             5  <- NOT EQUAL ->  4
	 6             6                   6
	 7             7  <- NOT EQUAL ->  8
	 8             8                   8
	 9             9  <- NOT EQUAL ->  8
	
	VIEW (20, 20)-(40, 40)             YmapReal = PMAP(I%,3)
	WINDOW SCREEN (0, 0)-( 20 , 20 )   YmapInt% = PMAP(I%,3)
	
	I%     PMAP(YmapReal, 1)    PMAP(YmapInt%, 1)
	 0             0                   0
	 1             1                   1
	 2             2                   2
	 3             3                   3
	 4             4                   4
	 5             5                   5
	 6             6                   6
	 7             7                   7
	 8             8                   8
	 9             9                   9
