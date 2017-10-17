---
layout: page
title: "Q38754: &quot;Interrupt Jumper Missing&quot; Error Message"
permalink: /pubs/pc/reference/microsoft/kb/Q38754/
---

## Q38754: &quot;Interrupt Jumper Missing&quot; Error Message

	Article: Q38754
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 6-DEC-1988
	
	The "Interrupt jumper missing" message can appear when installing the
	driver on a bus mouse. This can be caused by several things.
	
	It frequently appears because the interrupt selected on the
	J4 jumper is conflicting with existing hardware. If the
	IRQ vector is being used by anything else this message will
	appear.
	
	The message also can appear because the J2 jumper is set on slot 8 and
	not to normal as it should be.
	
	It also is possible that the interface card is defective. This can
	only be verified by installing the mouse and software onto another
	machine and testing the mouse.
