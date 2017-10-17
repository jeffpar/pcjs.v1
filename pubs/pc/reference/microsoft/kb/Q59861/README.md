---
layout: page
title: "Q59861: 400 DPI Serial Mouse and Northgate Computers"
permalink: /pubs/pc/reference/microsoft/kb/Q59861/
---

## Q59861: 400 DPI Serial Mouse and Northgate Computers

	Article: Q59861
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1990
	
	When the 400 PPI PS/2/Serial Mouse is installed on the 9-pin serial
	port of some Northgate Computer, the mouse may not install.
	
	When the 400 PPI PS/2/Serial Mouse is installed on the 9-pin serial
	port as a serial mouse, it uses pins 2, 3, 4, 5, and 7 to communicate
	with the serial port.
	
	The other pins in the 9-pin connector are used when the PS/2 adapter
	is connected to the mouse. Pin 8 of the built-in serial port, when set
	to a logic zero, is 1 to 2 volts higher than the voltage that would be
	present on an IBM compatible serial port. When a logic 1 is present on
	pin 8 and the mouse is connected to a 9-pin serial port, the mouse
	cannot reset. This prevents the mouse from installing.
	
	To work around this problem, do either of the following:
	
	1. Contact Northgate Technical Services at (800) 445-5037. They have
	   found the cause of the problem and will work with you to make the
	   necessary corrections to the motherboard.
	
	2. Use a 9- to 25-pin serial adapter to eliminate the signal from pin
	   8. To do this, you need to purchase the adapter from a local
	   electronics store. This adapter has a 9-pin female connector on one
	   end and a 25-pin male connector on the other end. Once you have the
	   adapter perform the following steps:
	
	   a. Attach the adapter you purchased to the built-in serial port of
	      your computer.
	
	   b. Attach the mouse to the 25- to 9-pin serial adapter that was
	      supplied with your mouse.
	
	   c. Attach this adapter to the 9- to 25-pin adapter that you have
	      already attached to your computer.
