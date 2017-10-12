---
layout: page
title: "Q59005: Returning to QuickC from PM May Corrupt Screen"
permalink: /pubs/pc/reference/microsoft/kb/Q59005/
---

	Article: Q59005
	Product: Microsoft C
	Version(s): m2.00 2.01
	Operating System: OS/2
	Flags: ENDUSER | buglist2.00 buglist2.01
	Last Modified: 6-MAR-1990
	
	If you are doing graphics in QuickC, returning to the DOS box from
	Presentation Manager (PM) and then exiting Quick C may generate red
	and white stripes on a flashing background in the DOS compatibility
	box. Mouse support will be disabled for the DOS compatibility box.
	This problem occurs when you exit from QuickC without returning the
	video mode to _DEFAULTMODE. Restoring the video mode to default
	prevents the problem.
	
	The effect can be demonstrated by doing the following:
	
	1. Execute the program (shown below) at the command line,
	
	       QCL BOX.C GRAPHICS.LIB
	
	2. Run the resulting .EXE either from the command line or in the
	   environment.
	
	3. Enter QuickC, as follows:
	
	       QC  (no file required to demonstrate the problem)
	
	4. Press CTRL+ESC to Presentation Manager.
	
	5. Re-enter the DOS compatibility box.
	
	6. Exit Quick C, as follows:
	
	      ALT+F.Exit
	
	Sample Code
	-----------
	
	#include <graph.h>
	void main()
	{
	   _setvideomode(_VRES16COLOR);
	/* _setvideomode(_DEFAULTMODE);  uncomment to correct behavior */
	}
	
	Microsoft has confirmed this to be a problem with QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
	
	This problem has been reproduced on a WYSE 386 with a FastWrite VGA
	and on a WYSE 286 with a Genoa Super VGA board. It has not been
	reproduced on a Compaq.
