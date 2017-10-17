---
layout: page
title: "Q27925: EGA and VGA Graphics Are Not Supported in OS/2 Protected Mode"
permalink: /pubs/pc/reference/microsoft/kb/Q27925/
---

## Q27925: EGA and VGA Graphics Are Not Supported in OS/2 Protected Mode

	Article: Q27925
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 31-JAN-1990
	
	EGA and VGA graphics are not supported in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b and Microsoft BASIC Professional Development
	System (PDS) Version 7.00 programs in the protected mode of OS/2.
	(Note also that COLOR is ignored in SCREEN 1.)
	
	The BASIC compiler talks directly to the hardware to perform EGA or
	VGA graphics. Applications that sit in OS/2 "ring 4" are not allowed
	to perform EGA or VGA graphics in the protected mode of OS/2.
	
	If the application needs to talk to the hardware, it must go through a
	device driver. There is currently not a device driver for EGA or VGA
	graphics in OS/2 protected mode.
