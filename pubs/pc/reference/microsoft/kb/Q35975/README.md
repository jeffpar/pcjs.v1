---
layout: page
title: "Q35975: Sluggish or Jerky Mouse Motion in PC DOS Version 4.00 Shell"
permalink: /pubs/pc/reference/microsoft/kb/Q35975/
---

	Article: Q35975
	Product: Microsoft C
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 11-OCT-1988
	
	When using the IBM PC DOS Version 4.00 shell mouse drivers with an IBM
	PS/2, the mouse motion may appear sluggish or jerky.
	
	To work around this problem, do not load the PC DOS Version 4.00 mouse
	drivers /MOS:PC??DRV.COM (where ?? is PC or MS) and load the Microsoft
	mouse driver MOUSE.COM before running the DOSSHELL.BAT file.
