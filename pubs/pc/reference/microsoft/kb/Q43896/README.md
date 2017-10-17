---
layout: page
title: "Q43896: Example of Graphics PUT on SCREEN 9 Using Bitmap DATA"
permalink: /pubs/pc/reference/microsoft/kb/Q43896/
---

## Q43896: Example of Graphics PUT on SCREEN 9 Using Bitmap DATA

	Article: Q43896
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890424-56 B_BasicCom
	Last Modified: 15-DEC-1989
	
	Below is an example of READing an image stored in DATA statements into
	an array, which is then used in a graphics PUT on SCREEN 9 (for EGA
	cards).
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b, and to
	Microsoft BASIC PDS Version 7.00.
	
	Code Example
	------------
	
	     SCREEN 9
	     sx = 102: sy = 104
	     DIM f395%(241)      'full screen 395 bitmap
	     FOR v% = 0 TO 241
	       READ f395%(v%)    'read 395 font
	     NEXT v%
	     PUT (sx, sy), f395%, XOR          'put 395 on screen
	     INPUT A$
	     END
	
	' bit map used to put 395 on screen
	DATA 46 , 20
	DATA 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0
	DATA -129 ,-1 ,-769 ,-129 ,-1 ,-769 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA -129 ,-1 ,-769 ,-129 ,-1 ,-769 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA  96 , 0 , 3072 , 96 , 0 , 3072 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA  96 , 0 , 3072 , 96 , 0 , 3072 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA  96, 0, 3072,-157 ,-7921 ,-29441 , 124 , 7920 , 31744 , 0, 0, 0
	DATA  96, 0, 3072,-157 ,-3809 ,-29441 , 124 , 3808 , 31744 , 0, 0 , 0
	DATA  96, 0, 3072, 3680 , 31036 , 3264 ,-3713 ,-31037 ,-961, 0, 0 , 0
	DATA  96, 0, 3072, 7264 , 14648 , 3264 ,-7297 ,-14649 ,-961, 0, 0 , 0
	DATA  96, 0, 3072, 15456, 31036, 3327,-15489,-31037,-1024, 0 , 0 , 0
	DATA  96, 0, 3072, 32352,-1761 ,-29441 ,-32385, 1760, 31744, 0, 0, 0
	DATA  96, 0, 3072, 3936,-18417,-13309 ,-3969, 18416, 15612, 0 , 0 , 0
	DATA  96, 0, 3072, 1895, 14336 ,-13311 ,-1928 ,-14337, 15614, 0, 0, 0
	DATA  96, 0, 3072,-28825, 31032,-13085, 28792,-31033, 15388, 0, 0, 0
	DATA  96, 0, 3072,-413 ,-4065 ,-29441 , 380 , 4064 , 31744, 0, 0, 0
	DATA  96, 0, 3072,-927 ,-8177 , 3199 , 894 , 8176 ,-896 , 0 , 0 , 0
	DATA  96, 0, 3072, 96 , 0 , 3072 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA  96, 0, 3072, 96 , 0 , 3072 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA -129 ,-1 ,-769 ,-129 ,-1 ,-769 ,-129 ,-1 ,-769 , 0 , 0 , 0
	DATA -129 ,-1 ,-769 ,-129 ,-1 ,-769 ,-129 ,-1 ,-769 , 0 , 0, 0
