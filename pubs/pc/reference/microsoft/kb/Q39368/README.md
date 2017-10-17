---
layout: page
title: "Q39368: QuickBASIC Program to Rotate Characters and Graphic Images"
permalink: /pubs/pc/reference/microsoft/kb/Q39368/
---

## Q39368: QuickBASIC Program to Rotate Characters and Graphic Images

	Article: Q39368
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881213-23
	Last Modified: 4-SEP-1990
	
	The subprogram below rotates two-dimensional graphic images. It takes
	as parameters the upper-left and lower-right corners of the region to
	rotate, and the number of degrees to rotate the picture.
	
	It also includes a subprogram that returns the upper-left corner of an
	ASCII-printed character for those who wish to rotate individual
	characters on the screen.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS; and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The character rotation will perform correctly only if the coordinate
	system is not altered (such as with the WINDOW statement).
	
	To rotate larger areas, compile with /ah.
	
	The program works correctly on screen modes 1, 2, 3 (Hercules), 7, 8,
	and 9. It can be expanded to support modes 10, 11, and 12 by changing
	the FindCharPos routine to include those screens.
	
	The more complex the image, the slower the program will run.
	
	The following is a code example:
	
	' This program is provided as is. No guarantees about performance
	' or support are implied.
	DECLARE SUB FindCharPos (row%, col%, gx%, gy%, screenmode%)
	DECLARE SUB RotatePic (ulx%, uly%, lrx%, lry%, deg!)
	DECLARE SUB RotatePoint (p!(), deg!)
	DECLARE SUB TranslatePoint (p!(), xdist!, ydist!)
	DECLARE SUB MatrixMult (p!(), t!())
	
	CLS
	INPUT "Enter Screen Mode (1, 2, 3, 7, 8, or 9) : ", screenmode%
	INPUT "Enter a Rotation (in Degrees) : ", r
	
	SCREEN screenmode%
	
	'** Rotating a Portion of a Picture **
	FOR row = 10 TO 150 STEP 10
	  LINE (10, row)-(150, row)
	NEXT row
	CALL RotatePic(55, 55, 100, 100, r)
	LOCATE 20
	INPUT "Press Enter to Continue", k$
	
	'** Rotating a Character **
	CLS
	textRow% = 10
	textCol% = 5
	LOCATE textRow%, textCol%
	PRINT "H"
	CALL FindCharPos(textRow%, textCol%, gx%, gy%, screenmode%)
	
	IF screenmode% = 3 OR screenmode% = 9 THEN  'Characters are 8x14
	  CALL RotatePic(gx%, gy%, gx% + 8, gy% + 14, r)
	ELSE                                        'Characters are 8x8
	  CALL RotatePic(gx%, gy%, gx% + 8, gy% + 8, r)
	END IF
	
	LOCATE 20
	INPUT "Press Enter ", k$
	
	SCREEN 0    '* Restore Screen *
	
	' * ----------------------------------------------------------- *
	
	SUB FindCharPos (row%, col%, gx%, gy%, screenmode%)
	'* Translates character coordinates to graphics coordinates. *
	'* Returns the upper left corner of the character box.       *
	
	  SELECT CASE screenmode%
	    CASE 1 TO 2
	      gx% = col% * 8 - 9
	      gy% = row% * 8 - 9
	    CASE 3             ' * Hercules *
	      gx% = col% * 8 + 1
	      gy% = row% * 14 - 14
	    CASE 7 TO 8
	      gx% = col% * 8 - 9
	      gy% = row% * 8 - 9
	    CASE 9
	      gx% = col% * 8 - 8
	      gy% = row% * 14 - 14
	    CASE ELSE
	      PRINT "Error in Screen Mode Setting - FindCharPos"
	  END SELECT
	END SUB
	
	SUB MatrixMult (p!(), t!())
	'* Multiply 1x4 array with a 4x4 array *
	
	  DIM r(1 TO 3) AS SINGLE
	
	  FOR i = 1 TO 3
	    r(i) = (p!(1) * t!(1,i)) + (p!(2) * t!(2,i)) + (p!(3) * t!(3,i))
	  NEXT i
	  FOR i = 1 TO 3
	    p!(i) = r(i)
	  NEXT i
	END SUB
	
	SUB RotatePic (ulx%, uly%, lrx%, lry%, deg!)
	' * This Program will scan any picture and replace it    *
	' * with a rotated version in the current foreground and *
	' * background colors.                                   *
	' * To rotate larger pictures, compile with /ah.         *
	
	  REM $DYNAMIC
	  DIM p(1 TO 3) AS SINGLE
	
	  xspan = lrx% - ulx%
	  yspan = lry% - uly%
	  IF FRE(-1) < (xspan * yspan * 2 * 2) THEN  '* Enough memory? *
	    PRINT "Area too large to rotate"
	    EXIT SUB
	  ELSE
	    DIM rotArea(1 TO xspan, 1 TO yspan, 1 TO 2) AS INTEGER
	  END IF
	
	  FOR i = 0 TO xspan - 1
	    FOR j = 0 TO yspan - 1
	      IF POINT(i + ulx%, j + uly%) <> 0 THEN
	        PSET (i + ulx%, j + uly%), 0
	        p(1) = i + ulx%
	        p(2) = j + uly%
	        p(3) = 1
	        CALL TranslatePoint(p(), CSNG(-ulx%) - (xspan / 2),_
	                                 CSNG(-uly%) - (yspan / 2))
	        CALL RotatePoint(p(), deg!)
	        CALL TranslatePoint(p(), CSNG(ulx%) + (xspan / 2),_
	                                 CSNG(uly%) + (yspan / 2))
	        rotArea(i + 1, j + 1, 1) = p(1)
	        rotArea(i + 1, j + 1, 2) = p(2)
	      END IF
	    NEXT j
	  NEXT i
	
	  FOR i = 1 TO xspan
	    FOR j = 1 TO yspan
	      PSET (rotArea(i, j, 1), rotArea(i, j, 2))
	    NEXT j
	  NEXT i
	END SUB
	
	REM $STATIC
	SUB RotatePoint (p!(), deg!)
	'* Set up the rotation matrix and multiply with the point. *
	
	  CONST PI = 3.14159
	
	  DIM RotMatrix(1 TO 3, 1 TO 3) AS SINGLE
	
	  radians! = deg! * PI / 180
	
	  RotMatrix(1, 1) = COS(radians!)
	  RotMatrix(1, 2) = SIN(radians!)
	  RotMatrix(2, 1) = -SIN(radians!)
	  RotMatrix(2, 2) = COS(radians!)
	  RotMatrix(3, 3) = 1
	
	  CALL MatrixMult(p!(), RotMatrix())
	END SUB
	
	SUB TranslatePoint (p!(), xdist!, ydist!)
	'* Set up the translation matrix and multiply with the point. *
	
	  DIM t(1 TO 3, 1 TO 3) AS SINGLE
	
	  t(1, 1) = 1
	  t(2, 2) = 1
	  t(3, 3) = 1
	  t(3, 1) = xdist!
	  t(3, 2) = ydist!
	
	  CALL MatrixMult(p!(), t())
	END SUB
