---
layout: page
title: "Q42553: &quot;Illegal Function Call&quot; Using VIEW, WINDOW, GET, or PUT"
permalink: /pubs/pc/reference/microsoft/kb/Q42553/
---

## Q42553: &quot;Illegal Function Call&quot; Using VIEW, WINDOW, GET, or PUT

	Article: Q42553
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890130-51 B_BasicCom
	Last Modified: 16-DEC-1989
	
	When using the QuickBASIC graphics functions GET, PUT, VIEW, and
	WINDOW, it is very easy to encounter the error "Illegal Function
	Call." The error can be generated for many reasons.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	If you encounter the above error, the following are some suggestions
	for determining where the error occurs:
	
	1. If "Illegal Function Call" occurs on a GET statement, do the
	   following:
	
	   a. Make sure you are actually GETting part of the screen or VIEW.
	
	   b. Make sure your array is large enough to hold the image. There is
	      a formula in the "Microsoft QuickBASIC: Programming in BASIC"
	      manual for Version 4.50 on Page 194 that calculates the size of
	      the array:
	
	      sizeinbytes=4+height*planes*INT((width*bitsperpixel/planes+7)/8)
	
	2. If "Illegal Function Call" occurs on the PUT statement, do the
	   following:
	
	   a. Make sure you are PUTting the image within the boundary of your
	      WINDOW or VIEW statement.
	
	   b. Certain problems that occur with the WINDOW statement may not
	      occur with the WINDOW SCREEN statement. The use of this
	      statement is discussed in the "Microsoft QuickBASIC 4.0: BASIC
	      Language Reference" manual for Versions 4.00 and 4.00b.
	
	3. If you use the following code example, when run under QuickBASIC
	   Version 4.50, you will get an "Illegal Function Call" when trying
	   to execute the PUT statement:
	
	   DEFINT A-Z
	   DIM image(40) AS LONG
	   SCREEN 9
	   VIEW (0,0)-(300,95)     ' Sets the view for the screen
	   WINDOW (0,0)-(300,190)  ' Sets screen coordinates
	   LINE (0,0)-(300,190),,B ' Draws a box around the vie
	   GET (0,1)-(0,189),Image ' Gets vertical image
	   SLEEP       10                ' Pause
	   PUT (0,1),Image,PSET    ' Put image back to screen
	   SLEEP 10                ' Pause
	
	   This error can be corrected in one of two ways:
	
	   a. The VIEW statement can be enlarged, from 95 to 96 or more.
	
	   b. The WINDOW statement can be changed to a WINDOW SCREEN.
	
	   The current program will not accept values of 95 or less with the
	   current WINDOW statement, but it will if a WINDOW SCREEN is used.
	   This WINDOW SCREEN statement alters the coordinates of the screen
	   to create a right-hand coordinate system.
