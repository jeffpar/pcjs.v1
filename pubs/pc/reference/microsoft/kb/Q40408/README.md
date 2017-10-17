---
layout: page
title: "Q40408: Setting the Overlay Interrupt (/O) in LINK"
permalink: /pubs/pc/reference/microsoft/kb/Q40408/
---

## Q40408: Setting the Overlay Interrupt (/O) in LINK

	Article: Q40408
	Version(s): 3.61 3.65
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 20-JAN-1989
	
	Question:
	
	Page 272, Section 12.2.12, of the "Microsoft CodeView and Utilities
	Software Development Tools for the MS-DOS Operating System" manual
	states that you can change the default overlay interrupt. The default
	interrupt is 3F hexadecimal. Is the manual correct? Do you have to
	change the interrupt if you have a program that uses overlays and it
	spawns a program that also uses overlays?
	
	Doesn't the compiler save interrupts? Suppose both Programs A and B
	use overlays and A spawns B. If B is a Microsoft C Version 5.00 or
	5.10 program, shouldn't it restore the original INT 3F address when it
	exits? Thus, everything should work correctly without
	/OVERLAYINTERRUPT.
	
	Response:
	
	You are correct; the C Versions 5.00 and 5.10 compiler saves and
	restores the interrupt so there should be no conflict. The C Versions
	5.00 and C 5.10 manual is incorrect. This switch need only be used if
	you are linking a program with overlays, and INT 3F is being used by
	something else when you run the program. For example, INT 3F might be
	used to communicate with a hardware board or a TSR might use it;
	however, this is unlikely.
	
	This option is for advanced users who know their configurations well
	enough to know who is using which interrupt vectors and know there is
	a conflict.
