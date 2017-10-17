---
layout: page
title: "Q38865: Cannot Use /2 Switch on IBM PS/2 in CodeView"
permalink: /pubs/pc/reference/microsoft/kb/Q38865/
---

## Q38865: Cannot Use /2 Switch on IBM PS/2 in CodeView

	Article: Q38865
	Version(s): 2.10 2.20  2.30 | 2.20 2.30
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G881031-5515
	Last Modified: 9-AUG-1989
	
	To use the /2 switch with CodeView, your computer must be equipped
	with a monochrome display (MDA) and a color display (CGA/EGA/VGA). The
	IBM PS/2 computers aren't currently configurable this way because they
	come with built-in VGAs or MDAs, but not both.
	
	If a hardware vendor starts selling MDAs that can be added to systems
	with built-in VGAs, this problem will be solved. An MDA card is
	needed that plugs into the PS/2 and works correctly in conjunction
	with the built-in VGA so that PS/2 owners can have a dual-monitor
	system.
	
	Currently, there is no solution to this debugging restriction other
	than using CodeView through the com port in sequential mode (/T) with
	a debugging terminal.
