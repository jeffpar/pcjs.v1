---
layout: page
title: "Q41078: Failure to Set Video to Text Mode When Swapping to Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q41078/
---

	Article: Q41078
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 apnote buglist2.01 s_quickasm
	Last Modified: 11-OCT-1989
	
	QuickC Version 2.00 and QuickAssembler 2.01 do not run properly
	on some computers equipped with CGA and Olivetti graphics adapters.
	When the display is in a graphics mode when QuickC swaps in the
	integrated environment screen, the video is not set to color text
	mode as it should be. The result is an unreadable graphics screen.
	The QuickC environment is still operable, but movement through
	the menus must be done by memory.
	
	Microsoft has confirmed this to be a problem in Versions 2.00 and
	2.01. There is a patch available that corrects the QC.EXE file in both
	QuickC 2.00 and QuickAssembler so that they properly switch video
	modes when swapping the QuickC screen and the program's output screen.
	
	Please contact Microsoft Product Support Services at (800) 454 2030 to
	obtain this patch.
	
	This problem can be observed in the following three ways:
	
	1. If the display is in a graphics mode when QuickC is invoked, QuickC
	   remains in graphics mode. To work around this problem, use the DOS
	   command MODE CO80 to set your display to text mode prior to invoking
	   QuickC.
	
	2. Use the following program:
	
	      #include <graph.h>
	      void main (void)
	      { _setvideomode (_MRES4COLOR);
	      }
	
	   When the above program is executed within the QuickC environment
	   (with F5) and a key is pressed to return back to QuickC, QuickC
	   remains in graphics mode. The workaround is to add the following
	   line:
	
	      _setvideomode (_DEFAULTMODE);
	
	3. Given the above program, press F8 twice to single step past the
	   _setvideomode function. The video will remain in graphics mode
	   when swapping back to the environment.
	
	   This scenario is the most severe. This prohibits one from debugging
	   a program that uses any graphics mode within the QuickC environment.
	
	This problem has been observed on the following equipment:
	
	   AT&T 6300 (8086, ROM-BIOS Version 1.43, MS-DOS Version 3.30)
	   Compaq Portable (8088, MS-DOS Version 3.30)
	   IBM PS/2 Model 80 (8514 Monitor, MS-DOS 3.30)
	
	The following are videomodes with which this has been observed:
	
	   _MRES4COLOR
	   _HRESBW
	   _ORESCOLOR
