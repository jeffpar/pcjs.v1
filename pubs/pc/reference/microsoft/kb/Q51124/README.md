---
layout: page
title: "Q51124: _arc() Generates Run-Time Error R6003"
permalink: /pubs/pc/reference/microsoft/kb/Q51124/
---

## Q51124: _arc() Generates Run-Time Error R6003

	Article: Q51124
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10 buglist2.00 buglist2.01 s_c
	Last Modified: 17-JAN-1990
	
	The C run-time function _arc() will generate the following error
	message if the sum of the absolute value of each coordinate in the
	bounding rectangle is greater than 32767:
	
	   run-time error R6003
	   -integer divide by 0
	
	For example, the function is prototyped with the following parameters:
	
	   short far _arc (x1, y1, x2, y2, x3, y3, x4, y4);
	
	For the function to work properly, the following statement must be
	true:
	
	   |x1| + |x2| <= 32767
	   |y1| + |y2| <= 32767
	
	The following program generates the R6003 error message:
	
	#include <stdio.h>
	#include <graph.h>
	
	/* COMMAND LINE:
	*/
	
	main()
	{
	      _setvideomode ( _VRES16COLOR );
	      _arc ( -20000, -120, 12768, 4480, 342, 346, 205, 315 );
	      getch();
	      _setvideomode ( _DEFAULTMODE );
	}
	
	Microsoft has confirmed this to be a problem in QuickC Versions 2.00
	and 2.01 and in C Version 5.10. We are researching this problem and
	will post new information here as it becomes available.
