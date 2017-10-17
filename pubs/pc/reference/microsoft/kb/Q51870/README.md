---
layout: page
title: "Q51870: Dual-Monitor Setup Requires 8-Bit Data Paths for Both Monitors"
permalink: /pubs/pc/reference/microsoft/kb/Q51870/
---

## Q51870: Dual-Monitor Setup Requires 8-Bit Data Paths for Both Monitors

	Article: Q51870
	Version(s): 1.00 2.00 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS                   | OS/2
	Flags: ENDUSER | s_c s_pascal h_fortran h_masm b_basiccom
	Last Modified: 21-MAR-1990
	
	When writing to a system that has a dual-monitor setup, you must make
	sure that both the monochrome monitor and the color monitor are using
	an 8-bit data path. In any dual-monitor write scheme, both display
	cards must be configured to write to a common data path (either both
	8-bit or both 16-bit mode). Today's monochrome adapters use 8-bit
	paths exclusively.
	
	Most display cards that use a 16-bit mode can autosense whether they
	are being written to in a dual-monitor mode, but some cards, such as
	the ATI VGA Wonder card, do not sense for this situation; therefore,
	you must set the card to an 8-bit path manually.
	
	If you are using dual monitors and you experience strange behavior
	such as garbage or blinking characters on the monochrome screen, make
	sure that your 16-bit video card is running in 8-bit mode.
	
	The most common use for a dual-monitor setup is for debugging graphics
	applications in CodeView.
