---
layout: page
title: "Q58025: DRAW Statement's Scale (S) Command Has Default Scale Factor 4"
permalink: /pubs/pc/reference/microsoft/kb/Q58025/
---

## Q58025: DRAW Statement's Scale (S) Command Has Default Scale Factor 4

	Article: Q58025
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom SR# S891228-74
	Last Modified: 5-FEB-1990
	
	The DRAW statement can scale the lines that it draws. The scale factor
	is specified by including the "S" command, followed by a number from 1
	to 255, before the commands that actually draw the lines.
	
	Certain manuals listed below fail to state that the default DRAW scale
	factor is 4, and they give the wrong formula to calculate the actual
	distance drawn.
	
	A scale factor of 8 must follow the "S" command to make a drawing
	twice as large. A scale factor of 2 makes a drawing half as large (4 *
	1/2 = 2).
	
	The following is the corrected formula for the DRAW "S n" (set Scale
	factor n) command:
	
	   The default scale factor n is 4, which causes no scaling. The scale
	   factor multiplied by movement-command arguments (U, D, L, R, or
	   relative M commands) divided by 4 gives the actual distance moved.
	
	This correction applies to the DRAW "S n" command in the following
	manuals:
	
	1. Page 138 of the "Microsoft QuickBASIC 4.5: BASIC Language
	   Reference" manual for Version 4.50
	
	   Note: The QB Advisor online Help of QuickBASIC 4.50 correctly
	   includes the fact that 4 is the default scale factor.
	
	2. Page 165 of the "Microsoft QuickBASIC 4.0: BASIC Language
	   Reference" manual for Versions 4.00 and 4.00b
	
	3. Page 165 of the "Microsoft BASIC Compiler 6.0: BASIC Language
	   Reference" manual for Versions 6.00 and 6.00b
	
	4. Page 255 of the "Microsoft QuickBASIC Compiler" Version 2.0x and
	   3.00 manual
	
	This documentation error was corrected in the "Microsoft BASIC 7.0:
	Language Reference" manual, provided with Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Knowing that the default scale factor is 4, it is easy to calculate
	the length of any line given any possible scale factor. The following
	formula can be used to do this:
	
	   <scaled line length> = (<scale factor> / 4) * <unscaled line length>
	
	Here <unscaled line length> is the unscaled distance that is given
	immediately after the drawing commands.
	
	Code Example
	------------
	
	The following program examples illustrate the correct use of the "S"
	command and how some scale factors affect what will be drawn. This
	example requires an EGA or VGA card. If you have a different card,
	change the SCREEN statement to an appropriate SCREEN mode.
	
	SCREEN 9
	'The "R" command of the DRAW statement draws a line to the right of
	'the current pixel position. The distance traveled is the number
	'entered after the command.
	DRAW "R10"     'No scale factor, line is 10 pixels long.
	DRAW "S1R10"   '(1/4) * 10 = 3 pixels long (rounded up).
	DRAW "S2R10"   '(2/4) * 10 = 5 pixels long.
	DRAW "S3R10"   '(3/4) * 10 = 8 pixels long (rounded up).
	DRAW "S4R10"   '(4/4) * 10 = 10 pixels long.
	DRAW "S5R10"   '(5/4) * 10 = 13 pixels long (rounded up.
	DRAW "S6R10"   '(6/4) * 10 = 15 pixels long.
	DRAW "S7R10"   '(7/4) * 10 = 18 pixels long (rounded up).
	DRAW "S8R10"   '(8/4) * 10 = 20 pixels long.
