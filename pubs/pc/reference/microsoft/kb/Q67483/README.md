---
layout: page
title: "Q67483: PWB Hangs with Novell NetWare"
permalink: /pubs/pc/reference/microsoft/kb/Q67483/
---

## Q67483: PWB Hangs with Novell NetWare

	Article: Q67483
	Version(s): 1.00 1.11
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_codeview s_c
	Last Modified: 14-DEC-1990
	
	On certain installations of a Novell network, the network will cause
	the Programmer's WorkBench (PWB) to hang. This problem may also occur
	in CodeView or QuickC. The hang usually occurs when an attempt is made
	to use the mouse.
	
	If you have a peripheral (such as a mouse) that uses Interrupt Request
	Level (IRQ) 3, and your system is part of a network using Novell
	NetWare version 2.15 or earlier, your system may hang when you load
	QuickC, PWB, or CodeView. As a temporary solution, set your peripheral
	to use another interrupt. For more information, contact your Novell
	NetWare dealer.
	
	If taking these steps does not solve the problem, please contact
	Microsoft Product Support Services.
