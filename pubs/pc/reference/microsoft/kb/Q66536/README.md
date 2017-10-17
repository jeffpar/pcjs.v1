---
layout: page
title: "Q66536: Practical Peripherals and Serial Mouse Configuration"
permalink: /pubs/pc/reference/microsoft/kb/Q66536/
---

## Q66536: Practical Peripherals and Serial Mouse Configuration

	Article: Q66536
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | mouse modem practical peripherals
	Last Modified: 15-NOV-1990
	
	If the Microsoft serial mouse is connected to COM 1, then a Practical
	Peripherals 2400 baud rate modem cannot be configured as COM 2.  This
	modem/mouse combination may work for a while, but eventually it
	will fail to an I/O address conflict between the mouse and the modem.
	
	Practical Peripherals technical support ([818] 991-8200)
	confirms this to be a problem.  They recommend that the modem be
	configured as COM 3 or COM 4.  The mouse should then remain on COM 1
	to separate the I/O addresses as much as possible.
