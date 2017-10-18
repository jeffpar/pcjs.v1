---
layout: page
title: "Q39370: Addressing above 1 Megabyte"
permalink: /pubs/pc/reference/microsoft/kb/Q39370/
---

## Q39370: Addressing above 1 Megabyte

	Article: Q39370
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | reference words
	Last Modified: 12-JAN-1989
	
	Question:
	
	The 80286 is capable of addressing a maximum of 16 megabytes of
	memory; however, with 16-bit segment and offset registers, I can only
	reach 1 megabyte. How can I address this extra memory?
	
	Response:
	
	When the 80286 is in real mode, it is not possible to reach that
	memory -- you are limited to 1 megabyte. To use that space, you have
	to put the processor into protected mode by using IBM ROM BIOS Call -
	Interupt 15 function 89h.
	
	For more information about this interrupt, call IBM hardware support
	at (800) 426-2468. This information is not covered in the DOS
	Encyclopedia.
