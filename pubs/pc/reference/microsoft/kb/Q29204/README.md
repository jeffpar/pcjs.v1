---
layout: page
title: "Q29204: Serial Mouse Pin-Outs"
permalink: /pubs/pc/reference/microsoft/kb/Q29204/
---

	Article: Q29204
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 5-JUN-1988
	
	The serial mouse includes a 9- and 25-pin adapter cable to work with
	a standard 9- or 25-pin IBM serial port. The following are the pin-outs
	of the mouse cables:
	
	                  Connectors
	
	   Function    9 pin      25 pin
	
	   RXD         pin 2      pin 3
	
	   TXD         pin 3      pin 2
	
	   RTS         pin 7      pin 4
	
	   GND         pin 5      pin 7
	
	   DTR         pin 4      pin 20
	
	   The serial mouse is a data communication equipment (DCE) device,
	and is a female device (i.e., it has holes in its connectors). Because
	it is a DCE device, the port's functions should be one to one when
	making a cable for a nonstandard serial port.
	   For example, the mouse's RXD should connect to your serial port's
	RXD and the mouse's TXD should connect to the serial port's TXD. This
	is true for other functions as well.
