---
layout: page
title: "Q28741: How to Deallocate or Disable the Mouse Driver"
permalink: /pubs/pc/reference/microsoft/kb/Q28741/
---

	Article: Q28741
	Product: Microsoft C
	Version(s): 6.0 6.02 6.10 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-APR-1988
	
	If the MOUSE.COM driver is installed, the Mouse Off command will
	deallocate the driver from memory if there were no other
	memory-resident programs loaded after it.
	   If the MOUSE.SYS driver was installed, the Mouse Off command will
	only disable the driver and not deallocate.
	   Although the mouse driver is deallocated or disabled, the mouse
	hardware will continue to send interrupts.
