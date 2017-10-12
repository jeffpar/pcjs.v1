---
layout: page
title: "Q28421: Network and Mouse Conflicts"
permalink: /pubs/pc/reference/microsoft/kb/Q28421/
---

	Article: Q28421
	Product: Microsoft C
	Version(s): 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 4-DEC-1988
	
	The bus mouse is interrupt selectable using the J4 jumper block
	located on the INPORT interface card. Make sure the netcard is not
	using the same interrupt; if your network card is using the same
	interrupt, it will crash when the mouse driver installs.
	
	The bus mouse uses its own I/O address (23c-23f). On the current
	interface cards this can be changed to the lower four bytes by
	selecting secondary INPORT (address 238-23b) over PRIMARY on the J3
	jumper setting. (note: moving the card to another slot may in
	addition solve the problem).
	
	If the above does not solve the problem or if you have the serial
	mouse, change the driver loading order or disable the driver (mouse
	off) when using the network.
	
	Contact the manufacturers of your netcard to see if they know of the
	above problem.
