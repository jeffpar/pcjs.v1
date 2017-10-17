---
layout: page
title: "Q39592: In QB.EXE 4.50, No Editor Color on TANDY 1000 with CGA"
permalink: /pubs/pc/reference/microsoft/kb/Q39592/
---

## Q39592: In QB.EXE 4.50, No Editor Color on TANDY 1000 with CGA

	Article: Q39592
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881215-3
	Last Modified: 5-JAN-1989
	
	Running QB.EXE Version 4.50 on an "older" TANDY 1000 with CGA graphics
	circuitry built-in to the mother board (CGA, 640 x 200 pixels) brings
	up the QuickBASIC environment in black and white (monochrome).
	
	Invoking QuickBASIC with the /b, /nohi, or /h option or any
	combination of these options does not correct the problem. The MS-DOS
	command MODE CO80 also does not help.
	
	It has been reported that QuickBASIC Version 4.00b and earlier
	versions supported color under the QB.EXE environment on this system.
	
	Another customer using a TANDY 1000 SX reported a similar problem. The
	customer worked around the problem by doing the following:
	
	1. Issue the following MODE command in MS-DOS:
	
	      MODE CO80
	
	2. Now, when you invoke QB.EXE Version 4.50, you still get black and
	   white, but if you select the Options... menu, you can see and
	   select the desired colors.
	
	3. When you exit QuickBASIC, the QB.INI file will contain the new
	   settings. The next time you invoke QB.EXE, it will come up in
	   color.
