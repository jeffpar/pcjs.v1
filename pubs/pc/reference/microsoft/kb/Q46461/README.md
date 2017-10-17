---
layout: page
title: "Q46461: Mouse Performance between Serial and Bus Mouse"
permalink: /pubs/pc/reference/microsoft/kb/Q46461/
---

## Q46461: Mouse Performance between Serial and Bus Mouse

	Article: Q46461
	Version(s): 1.x 2.x 3.x 4.x 5.x 6.x 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-AUG-1989
	
	Summary
	
	Although there are no differences in functionality between the bus and
	serial mouse, you should be aware that there are differences in the
	way the mouse interrupts the CPU (i.e., the mouse driver must be
	installed).
	
	The serial mouse is event driven. This means when you neither move the
	mouse nor press a button (i.e., the mouse is not in use), there is no
	degradation to the CPU processing. When the mouse is being used, an
	approximately 5-percent degradation to the CPU performance can occur.
	
	The bus mouse is not event driven. When you neither move the mouse nor
	press a button, the mouse interrupts the CPU at either the default (30
	Hz) or at the user-defined rate (50, 100, or 200 Hz).
