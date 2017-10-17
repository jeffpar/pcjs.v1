---
layout: page
title: "Q68110: I/O Addresses for the Microsoft Mouse"
permalink: /pubs/pc/reference/microsoft/kb/Q68110/
---

## Q68110: I/O Addresses for the Microsoft Mouse

	Article: Q68110
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 10-FEB-1991
	
	The following are the ranges in which an I/O (Input/Output) port
	assignment may occur for the Microsoft Mouse. The ranges are given in
	hexadecimal numbers, and the serial communications port assignments
	conform to the IBM standard I/O address range assignments for PCs and
	PS/2s.
	
	SERIAL MOUSE
	------------
	
	Port Assignments    Address Ranges
	----------------    --------------
	
	COM1                3F8H-3FFH
	
	COM2                2F8H-2FFH
	
	BUS MOUSE (BUS INTERFACE BOARD SETTINGS)
	----------------------------------------
	
	Primary Inport Range
	--------------------
	
	23CH-23FH
	
	Secondary Inport Range
	----------------------
	
	238H-23BH
	
	An I/O port acts as a doorway through which information travels.
	Information may originate from the CPU, travel over data and address
	buses, pass through the I/O port, and finally reach a peripheral
	device such as the mouse. Although the CPU recognizes various ports
	through 16-bit port numbers that range from 00H through FFFFH, the
	port address is not actually an address found in main memory. A port
	assignment is a memory location separate from a (main) memory address
	that is associated with that particular I/O port.
	
	No other peripheral device, such as a modem or printer, may share the
	same I/O address with the mouse or the mouse may not function
	correctly.
