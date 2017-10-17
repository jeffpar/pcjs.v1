---
layout: page
title: "Q28538: Bus Mouse Jumper Settings J2, J3, and J4"
permalink: /pubs/pc/reference/microsoft/kb/Q28538/
---

## Q28538: Bus Mouse Jumper Settings J2, J3, and J4

	Article: Q28538
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 5-JUN-1988
	
	The new white-button Bus Mouse Version 1.00 interface card
	(Revision G) is an InPort interface half-size card. When installing
	the interface card, the jumper settings J2, J3, and J4 must be
	correctly set for the mouse to function properly.
	
	   The J2 jumper setting allows you to use your Bus mouse from slot 8
	if you have an IBM PC XT. Set the top two pins to the "XT SLOT 8"
	configuration. If you have an IBM PC, AT, or some other non-IBM PC XT,
	you can leave the jumper setting on the "Normal" position (the lower
	two settings).
	   The J3 jumper setting allows you to set another I/O address space
	other than the default 23C-23F. The "Primary" settings are the top two
	settings, while the "Secondary," which has the I/O address 238-23C, is
	the bottom two settings.
	   Microsoft recommends that you only change this setting if another
	InPort interface hardware item is used in your system or if another
	system peripheral card is using the same I/O addresses.
	   The J4 jumper setting allows you to select an IRQ or machine
	interrupt. Microsoft recommends that you select an interrupt from two
	through five that is not used in your system. In most instances,
	although you should confirm that another card is not using the same
	interrupt, an IBM PC or XT has interrupt two available for you to use
	and an IBM PC AT usually has interrupt five available.
	   Refer to Page 6 of your "Microsoft Mouse User's Guide" for more
	information.
