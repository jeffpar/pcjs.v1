---
layout: page
title: "Q57649: CIRCLE Statement Draws Ellipses Based on Horizontal Resolution"
permalink: /pubs/pc/reference/microsoft/kb/Q57649/
---

## Q57649: CIRCLE Statement Draws Ellipses Based on Horizontal Resolution

	Article: Q57649
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891227-98 B_BasicCom
	Last Modified: 12-JAN-1990
	
	Circles and ellipses generated using the CIRCLE statement are based on
	the current horizontal resolution of the current coordinate system.
	This can result in what may appear to be incorrect circles or ellipses
	for the radius value given in the CIRCLE statement.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00, 6.00b for MS-DOS,
	and to Microsoft BASIC Professional Development System (PDS) Version
	7.00 for MS-DOS.
	
	When an ellipse is generated using the CIRCLE statement, the ellipse
	will never be wider or taller than the radius value given in the
	CIRCLE statement using the horizontal resolution of the current
	coordinate system. The following code examples demonstrate this using
	all three possibilities, using VGA SCREEN mode 12:
	
	   X-resolution < Y-resolution: WINDOW(-320,440)-(320,440)  '640x880
	   X-resolution = Y-resolution: WINDOW(-320,240)-(320,240)  '640x480
	   X-resolution > Y-resolution: WINDOW(-620,240)-(620,240)  '1240x480
	
	Each program draws a circle using the CIRCLE statement, with a center
	at (0, 0) and a radius of 100. A box is then drawn using the LINE
	statement, with its center at (0, 0) and sides with a length of 200.
	In a coordinate system of one-to-one, the default in SCREEN 12, this
	produces a circle and a box in the center of the screen with the
	circle tangent to all four sides of the box. When the coordinate
	system is altered using a WINDOW statement, the circle always remains
	tangent to the left and right sides of the box, but either falls short
	of or exceeds the top and bottom of the box.
	
	Code Example 1
	--------------
	
	'*** X-resolution < Y-resolution ***
	SCREEN 12
	WINDOW(-320,440)-(320,440)
	CIRCLE(0, 0), 100
	LINE(-100, -100)-(100, 100),,B
	END
	
	Code Example 2
	--------------
	
	'*** X-resolution = Y-resolution ***
	SCREEN 12
	WINDOW(-320,240)-(320,240) 'Commenting this line out gives same result
	CIRCLE(0, 0), 100
	LINE(-100, -100)-(100, 100),,B
	END
	
	Code Example 3
	--------------
	
	'*** X-resolution > Y-resolution ***
	SCREEN 12
	WINDOW(-620,440)-(620,440)
	CIRCLE(0, 0), 100
	LINE(-100, -100)-(100, 100),,B
	END
