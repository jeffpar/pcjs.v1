---
layout: page
title: "Q48058: Graphics Algorithm Different in QuickBASIC Versus GW-BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q48058/
---

## Q48058: Graphics Algorithm Different in QuickBASIC Versus GW-BASIC

	Article: Q48058
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890811-64  B_BasicCom B_GWBasicI
	Last Modified: 15-DEC-1989
	
	When constructing an image with multiple-line statements, the image
	may not appear as fully symmetrical as the x and y coordinates
	indicate. The algorithm used by QuickBASIC to draw the various graphic
	images executes the starting and ending coordinates in a specific
	order to produce the fastest results. This algorithm is different than
	that of GW-BASIC, where each line is drawn literally.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS, to Microsoft BASIC
	PDS Version 7.00, and to Microsoft GW-BASIC Versions 3.20, 3.22, and
	3.23 for MS-DOS.
	
	The algorithm used by QuickBASIC to draw the various graphic images
	determines the fastest way to draw the image and then constructs that
	image on the screen. The LINE statement is the best example, with the
	following syntax:
	
	   LINE (50,0) - (100,200)
	   LINE (150,0) - (100,200)
	
	Under QuickBASIC, the algorithm draws the initial line, from (50,0) to
	(100,200), then evaluates the next statement and draws the next line
	from (100,200) to (150,0). GW-BASIC draws the first line similar to
	QuickBASIC, but then draws the next line from (150,0) to (100,200).
	
	This is not considered a problem, but is a feature of the QuickBASIC
	graphics algorithm that makes it faster and more efficient than the
	interpreted sequential method of graphics. This difference is
	illustrated when using a medium to low resolution graphics screen, as
	in the following code example. The two lines drawn do not look
	symmetrical under QuickBASIC, but are drawn identically under
	GW-BASIC. The two lines are exactly the same, but one is inverted from
	the other.
	
	Code Example
	------------
	
	10 SCREEN 1
	20 LINE (160, 90)-(140, 1), 1
	30 LINE (162, 90)-(182, 1), 1
