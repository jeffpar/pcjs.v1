---
layout: page
title: "Q44352: DRAW Statement Doesn't Affect WINDOW's Physical Coordinates"
permalink: /pubs/pc/reference/microsoft/kb/Q44352/
---

## Q44352: DRAW Statement Doesn't Affect WINDOW's Physical Coordinates

	Article: Q44352
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890503-247 B_BasicCom
	Last Modified: 20-DEC-1989
	
	The DRAW statement does not change the screen's logical coordinates,
	which are set using the WINDOW statement. The DRAW statement uses only
	physical coordinates, whereas normal graphics statements (PSET, LINE,
	CIRCLE) are specified with view coordinates.
	
	While the view coordinates are not changed by the DRAW statement, the
	physical coordinates [returned in POINT(0) and POINT(1)] are changed
	by the normal graphics statements.
	
	This information applies to QuickBASIC Versions 3.00, 4.00, 4.00b, and
	4.50, to Microsoft BASIC Compiler 6.00 and 6.00b, and to Microsoft
	BASIC PDS Version 7.00.
	
	In the following code sample, the first CIRCLE specified with view
	coordinates sets the physical coordinates [returned by POINT(0) and
	POINT(1)] to the equivalent point (at the center of the CIRCLE). The
	ensuing DRAW statement draws a line from the center point to the point
	specified in the DRAW. This DRAW statement changes the physical
	coordinates [shown by the values of POINT(0) and POINT(1)] but leaves
	the view coordinates unchanged [POINT(2) and POINT(3)]. The second
	CIRCLE statement will be centered on the view coordinates of the
	center point of the first CIRCLE, rather than the physical coordinates
	of the other end of the line created with the DRAW.
	
	Code Example
	------------
	
	SCREEN 9
	WINDOW (0, 0)-(60, 60)
	CIRCLE (10, 10), 4   ' Set the 1st point Physical and view correspond
	
	PRINT "First CIRCLE Coordinates:"
	PRINT "Physical coordinates = ("; POINT(0); ","; POINT(1); ")"
	PRINT "View     coordinates = ("; POINT(2); ","; POINT(3); ")"
	PRINT
	
	DRAW "M20,20"         ' DRAW line -- Physical changed; view unchanged
	
	PRINT "DRAW Coordinates:"
	PRINT "Physical coordinates = ("; POINT(0); ","; POINT(1); ")"
	PRINT "View     coordinates = ("; POINT(2); ","; POINT(3); ")"
	PRINT
	
	CIRCLE STEP(0, 0), 8  ' Centers around 1st CIRCLE not far end of DRAW
	
	PRINT "Second CIRCLE Coordinates:"
	PRINT "Physical coordinates = ("; POINT(0); ","; POINT(1); ")"
	PRINT "View     coordinates = ("; POINT(2); ","; POINT(3); ")"
	PRINT
	
	END
