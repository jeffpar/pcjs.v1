---
layout: page
title: "Q43344: Deallocating Memory When Using Compaq and IBM Mouse Ports"
permalink: /pubs/pc/reference/microsoft/kb/Q43344/
---

	Article: Q43344
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-AUG-1989
	
	When using a PS/2 style mouse port, you cannot deallocate the memory
	the mouse driver is using. The Mouse Off switch disables only the
	mouse. However, the memory will be deallocated if a bus or serial
	mouse is used.
	
	The following machines have PS/2 style mouse ports:
	
	1. COMPAQ 286e, 386s, 386e, and 386 20e
	
	2. IBM (all PS/2's)
