---
layout: page
title: "Q42581: Solutions to QuickC 2.00 Color Problems on Isolated Machines"
permalink: /pubs/pc/reference/microsoft/kb/Q42581/
---

## Q42581: Solutions to QuickC 2.00 Color Problems on Isolated Machines

	Article: Q42581
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | appnote
	Last Modified: 2-MAY-1989
	
	QuickC Version 2.00 has been shown to have a problem on TANDY 1000s
	and PCjrs that causes the colors of the QuickC environment to be
	unreadable. There are two solutions to this:
	
	1. TANDY DOS has an extended MODE command that allows the palette to
	   be remapped. The format of this command is as follows:
	
	      MODE  COLORMAP <color to be changed>  <desired color>
	
	   For more details on this command and its usage, refer to the TANDY
	   DOS reference manual. To resolve the color problem in QuickC 2.00,
	   you should follow these steps:
	
	   a. Enter QuickC (the color problem will present itself).
	
	   b. Exit QuickC (exit, not DOS shell; the poor color choice will
	      remain).
	
	   c. Use the MODE command to remap the colors. The following single
	      remapping will resolve the majority of the color conflict:
	
	         MODE COLORMAP  MAGENTA GRAY
	
	   Further remappings can be used to tailor the colors to your liking.
	
	2. The above resolution assumes that you have TANDY DOS. If you do not
	   have TANDY's DOS, there is a similar patch that Product Support has
	   made available in an application note. This application note is
	   available from Product Support by calling (206) 454-2030.
