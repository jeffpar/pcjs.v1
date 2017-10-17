---
layout: page
title: "Q36935: Writing to Video Memory in the QuickC Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q36935/
---

## Q36935: Writing to Video Memory in the QuickC Environment

	Article: Q36935
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-NOV-1988
	
	Problem:
	
	Code that writes directly to video memory compiles properly within
	QuickC, but may not execute as you would expect if you run the code in
	the QuickC environment.
	
	This problem occurs because when you write directly to video memory
	within the QuickC environment, you will over-write, distort, or
	corrupt the screen information for QuickC. You may also hang the
	computer.
	
	More Info:
	
	If you are trying to achieve some effect through writing directly to
	the video memory while in QuickC's environment, you should try other
	alternatives instead, such as using DOS or BIOS interrupts.
