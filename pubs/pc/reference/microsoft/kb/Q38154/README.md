---
layout: page
title: "Q38154: Graphic Routines Fail to Use Active Card when Two are Present"
permalink: /pubs/pc/reference/microsoft/kb/Q38154/
---

	Article: Q38154
	Product: Microsoft C
	Version(s): 1.00 1.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_c
	Last Modified: 17-NOV-1988
	
	On machines with two graphics cards, the graphics package shipped
	with QuickC and the C Versions 5.00 and 5.10 optimizing compiler will
	use only the higher-resolution card for graphic output, regardless of
	which is the active card. The only solution is to remove the second
	card. However, this is a particular problem with machines such as the
	PS/2 model 30, which has a built-in MCGA card.
	
	QuickC will recognize an add-on VGA card, which has higher resolution
	than MCGA; however, it will not recognize an add-on EGA card, which,
	although it provides lower resolution than the MCGA, is considered by
	many to be a superior card for graphic output. If an attempt is made
	to use _setvideomode to set the system into an EGA mode, _setvideomode
	will return an error.
	
	The graphics routines do not rely solely on the bios. Issuing a bios
	call (Int 10, Function 0FH - Get Video Mode) to determine whether or
	not the bios recognizes the EGA as the active card will return the
	value for an EGA-only mode. However, the graphics routines will
	continue to use the MCGA card.
