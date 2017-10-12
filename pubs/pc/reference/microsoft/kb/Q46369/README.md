---
layout: page
title: "Q46369: InPort/Bus Mouse Comparison and Overview"
permalink: /pubs/pc/reference/microsoft/kb/Q46369/
---

	Article: Q46369
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | SR# G890626-21385
	Last Modified: 31-AUG-1989
	
	Question:
	
	Could you clarify the difference between the Microsoft Bus Mouse and
	the InPort Mouse?
	
	Response:
	
	The Microsoft InPort device interface is a low-cost graphic device
	interface consisting of a 40-pin custom LSI IC and a compact 9-pin
	circular connector, which supports a variety of graphic input devices,
	especially mice.
	
	The following is a comparison between old Bus Mouse and new InPort
	Mouse:
	
	1. The InPort Mouse uses a custom Microsoft designed 40-pin LSI
	   interface chip manufactured by OKI Inc. of Japan.
	
	   The Bus Mouse uses a generic Intel 8255A parallel interface chip.
	
	2. The InPort Mouse allows the CPU interrupt rate to be programmable
	   from 0 (no interrupt) to 200 Hz.
	
	    The Bus Mouse CPU interrupt rate is fixed at 30 Hz.
	
	3. The InPort Mouse interrupts the CPU only when the mouse position
	   or button status has changed.
	
	    The Bus Mouse interrupts the CPU constantly regardless of mouse
	    (in)activity.
	
	4. The InPort Mouse requires only two I/O operations to read the mouse
	   XY position.
	
	   The Bus Mouse requires four I/O operations to read mouse XY
	   position.
	
	5. The InPort Mouse uses the compact Hosiden 9-pin circular connector.
	
	   The Bus Mouse uses the bulky DB-9 connector.
	
	When used stand-alone with an IBM XT/AT PC, both mice use an interface
	board that plugs into the standard IBM XT/AT bus. In addition, since
	the InPort custom IC is essentially an enhanced, single-chip version
	of the Microsoft Bus Mouse interface board, other manufacturers can
	easily add the InPort interface to their PC plug-in cards. The
	following are examples:
	
	1. The Microsoft MACH 10 enhancement board
	
	2. Renaissance GRX graphics add-in boards
	
	3. Selected Verticom graphics controllers/adapters come with an InPort
	   interface.
	
	The InPort Mouse can also connect to an RS-232 serial port, or the
	IBM PS/2 mouse port through an external adapter box.
