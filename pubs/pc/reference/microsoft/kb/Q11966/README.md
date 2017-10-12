---
layout: page
title: "Q11966: Using Two Monitors with CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q11966/
---

	Article: Q11966
	Product: Microsoft C
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER | TAR56465
	Last Modified: 11-SEP-1989
	
	Question:
	
	How do I use CodeView with two monitors? Where is this option
	documented?
	
	Response:
	
	Invoke CodeView with the following command:
	
	   CV /2 PROGRAM
	
	This command tells CodeView to put its display on your secondary
	monitor and lets your program's output go to the default display. This
	option is documented in the "CodeView Options" section of the
	"Microsoft CodeView and Utilities Software Development Tools for the
	MS-DOS Operating System" manual in all products except Microsoft C
	Version 4.00, where it is documented in the README file.
	
	You must have two monitors and two display adapters to use this
	feature. You must have a monochrome and a non-monochrome monitor;
	because a monochrome monitor's video memory is in a different
	location than a CGA, EGA, or VGA's. This is how CodeView implements
	the /2 option, by writing to both sets of video memory.
	
	When you use the /2 option, your program's display appears on the
	current default adapter and monitor, while the debugging display
	appears on the secondary adapter and monitor. You can switch which
	monitor is the current default adapter with the MS-DOS MODE command.
	"MODE MONO" causes standard output to go to the MDA, while "MODE CO80"
	causes standard output to go to your CGA, EGA, or VGA.
	
	For example, if you have both a CGA and an MDA, you might want to set
	the CGA up as the default adapter. You could then debug a graphics
	program with the graphics display appearing on the graphics monitor
	and the debugging display appearing on the monochrome adapter.
