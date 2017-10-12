---
layout: page
title: "Q31994: How Overlays Are Set Up By the Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q31994/
---

	Article: Q31994
	Product: Microsoft C
	Version(s): 3.x 4.06 4.07 5.01.20 5.01.21 5.03
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JAN-1990
	
	The overlay linker uses an interrupt to call in overlaid files. By
	default, the interrupt number used for passing control to overlays is
	63 (3f hex).
	
	The linker links the Microsoft overlay manager from the standard
	Microsoft language run-time libraries. The linker assigns segments to
	overlays based on the grouping you indicate. It replaces
	overlay-to-overlay far calls and root-to-overlay far calls with an
	interrupt sequence that calls the overlay manager. The overlay manager
	swaps overlays if necessary and returns control to the program.
	
	The linker replaces root-to-overlay and overlay-to-overlay far calls
	with the following sequence:
	
	   INT     3Fh         ; can change # with /OVERLAYINTERRUPT:#
	   DB      ?           ; target overlay segment number, where
	                       ; every non-root code segment is numbered
	                       ; starting at 1
	   DW      ?           ; target offset within segment
	
	The interrupt handler is set to the overlay manager code that swaps
	out the resident overlay if necessary and swaps in the target overlay,
	then jumps to the target address. The overlay manager does nothing
	unusual in servicing the interrupts; it does not disable interrupts.
	However, it may issue INT 21h calls to swap overlays.
	
	The overlay manager assumes that once your initialization code has
	been executed, DS and SS will always be the same. Furthermore, it
	assumes you will initialize DS and SS to the value of DGROUP (the
	default data segment defined by Microsoft languages). Note that your
	program also must have a stack segment.
	
	A more detailed description of the overlay manager can be found on
	Page 715 of the "MS-DOS Encyclopedia," "Article 20: The Microsoft
	Object Linker."
