---
layout: page
title: "Q67205: DRAW Statement to Erase or Redraw Image May Not Work Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q67205/
---

## Q67205: DRAW Statement to Erase or Redraw Image May Not Work Correctly

	Article: Q67205
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM B_GWBASICI buglist4.00 buglist4.00b buglist4.50
	Last Modified: 5-DEC-1990
	
	Under some circumstances the DRAW statement will incorrectly redraw
	the same figure.
	
	A common method of erasing an image is to draw an image with the
	drawing color and then redraw it with the background color. However,
	as this article describes, it is possible that DRAWing the exact same
	picture over the previously drawn picture may not completely erase the
	image, resulting in "droppings" being left on the screen.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Compiler versions 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS;
	in Microsoft BASIC Compiler versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b) for MS-DOS and MS OS/2; in Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 (buglist7.00,
	buglist7.10) for MS-DOS and MS OS/2; and in Microsoft GW-BASIC
	Interpreter versions 3.20, 3.22, and 3.23 (buglist3.20, buglist3.22,
	buglist3.23). We are researching this problem and will post new
	information here as it becomes available.
	
	When the DRAW command "TA" is executed, the angles calculated should
	be consistent. However, a second iteration of the same command with a
	different color produces a slightly different image.
	
	The problem seems to occur only in certain examples, regardless of the
	screen mode or product version used. Microsoft has duplicated this
	problem only when using the "TA" angle rotation command in conjunction
	with a "B" (move but don't plot) command.
	
	The code example below demonstrates this problem. The program below
	continually draws a line and then immediately redraws that line with
	the background color to erase the line. On each iteration of the loop,
	the angle of the line is rotated. For a few of the lines, the DRAW
	command will not completely erase some of the lines drawn.
	
	Code Example
	------------
	
	SCREEN 9: CLS
	L$ = "U65 BU5 D70"
	DO
	        FOR i = 0 to 360 STEP 3
	                DRAW "C14TA=" + VARPTR$(i) + L$
	                DRAW "C0TA=" + VARPTR$(i) + L$
	        NEXT i
	LOOP UNTIL INKEY$ <> ""
	END
	
	In this specific example, the "BU" command must be in the DRAW string
	or the problem will not occur.
	
	Additional reference words: buglist3.00 buglist2.01 buglist2.00
