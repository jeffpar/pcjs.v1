---
layout: page
title: "Q40519: Compaq ADAPT.COM TSR Is Not Compatible with QC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q40519/
---

	Article: Q40519
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-JAN-1989
	
	The Compaq Computer Corporation produces a memory-resident tool called
	ADAPT.COM that is used to change the manner in which intensified
	characters are displayed on the screen. It is used most often for
	liquid crystal displays (LCDs) and plasma screens on portables.
	
	Invoking ADAPT.COM (CTRL+SHIFT) while inside the QuickC Version 2.00
	environment will hang the computer; you will need to reboot your
	machine. The typical symptom of this hanging is that the
	terminate-and-stay-resident program (TSR) will adamantly refuse to
	release your computer and allow a return to QuickC.
	
	Version 2.00 of the Microsoft QuickC compiler is not compatible with
	this TSR. To avoid this conflict, you must adhere to the following:
	
	1. Do Not invoke ADAPT.COM within the QuickC 2.00 Environment.
	2. Execute ADAPT.COM before or after QuickC Editing Sessions.
	
	Microsoft has confirmed this problem with Version 2.00 of the QuickC
	compiler. Microsoft will post new information as it becomes available.
