---
layout: page
title: "Q34009: Jumper Settings for Bus Mouse Used in an XT 286"
permalink: /pubs/pc/reference/microsoft/kb/Q34009/
---

## Q34009: Jumper Settings for Bus Mouse Used in an XT 286

	Article: Q34009
	Version(s): 1.x 2.x 3.x 4.x 5.x 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 23-AUG-1988
	
	For the purpose of setting the jumpers on the bus mouse card, the
	IBM XT 286 is equivalent to an IBM AT. The hard disk in the IBM XT 286
	uses IRQ 2. The typical settings are as follows:
	
	   Jumper    Setting
	     J2      normal
	     J3      primary
	     J4      IRQ 5
	
	   As always, be sure that IRQ 5 is not being used for other hardware
	devices, such as a Bernoulli box, network card, or tape backup.
