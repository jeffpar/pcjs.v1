---
layout: page
title: "Q67374: CIRCLE(x,y),rad,,-0.1,0 Draws Only the Radius in BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q67374/
---

## Q67374: CIRCLE(x,y),rad,,-0.1,0 Draws Only the Radius in BASIC

	Article: Q67374
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | B_MQuickB B_QuickBas
	Last Modified: 17-JAN-1991
	
	This article describes a problem with the CIRCLE statement. The CIRCLE
	command takes the following parameters:
	
	   CIRCLE[STEP](x,y),radius!,,start!,stop!
	
	If you specify start! and stop!, with start! slightly larger than
	stop!, then the CIRCLE command should draw an almost complete circle.
	However, if the difference between start! and stop! is very small,
	CIRCLE may draw only a point or radius, instead of an almost complete
	circle. This problem happens in both the interpreter environment and
	in compiled programs.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	version 1.00 (buglist1.00) for Apple Macintosh systems; in Microsoft
	QuickBASIC versions 4.00, 4.00b, and 4.50 (buglist4.00, buglist4.00b,
	buglist4.50) for MS-DOS; in Microsoft BASIC Compiler versions 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS OS/2; and in
	Microsoft BASIC Professional System (PDS) versions 7.00 and 7.10
	(buglist7.00, buglist7.10) for MS-DOS and OS/2. We are researching
	this problem and will post new information here as it becomes
	available.
	
	Changing the size of radius changes the requirement for the distance
	between start! and stop! necessary to reproduce the problem. When
	start! is near zero, leaving off the stop! will produce different
	results than if stop! is specified. Use the following code examples
	to reproduce the problems described above.
	
	Code Examples
	-------------
	
	' When start! or stop! is negative, CIRCLE draws a radius and
	' treats the angle as positive. Without the negative sign, no
	' radius is drawn.
	'
	SCREEN 12  'Problem occurs in any graphics screen mode.
	10 CIRCLE (50, 50), 50, , -.01         'Works correctly.
	20 CIRCLE (50, 150), 50, , -.01, 0     'Should be same as line
	                                       '10 but draws only the radius.
	30 CIRCLE (50, 250), 50, , -.011, 0    'Slightly larger difference
	                                       'from start & stop works.
	40 CIRCLE (420, 240), 200, , -.01, 0   'This works with same end/start
	                                       'as line 20 but has larger
	                                       'radius
	
	On the Apple Macintosh, use the following code:
	
	CIRCLE (50, 50) 10, ,-0.001, 0
