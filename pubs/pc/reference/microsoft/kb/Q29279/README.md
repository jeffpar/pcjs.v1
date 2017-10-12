---
layout: page
title: "Q29279: Bus Mouse May Not Work on IRQ 2 on a 386 with OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q29279/
---

	Article: Q29279
	Product: Microsoft C
	Version(s): 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-SEP-1988
	
	The OS/2 mouse driver MOUSEA04.SYS will not install if you use the IRQ
	2 setting for OS/2 and a Wyse 386. MOUSEA03.SYS will install, but
	will not work in OS/2. The mouse works properly in DOS.
	
	OS/2 seems to be more sensitive to the IRQ usage. This problem occurs
	with both the old and new bus mice. To work around the problem, use
	another interrupt other than 2 on the 386.
	
	Although IRQ2 is not recommended for ATs or 386s, the mouse seems to
	work without any problems in the DOS environment (using all other
	interrupts); however, this does not seem to be the case in OS/2.
